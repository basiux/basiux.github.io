// this shall be split into a few more files yet

function sigmoid (x) {
        return 2/(1+Math.exp(-4.9*x))-1;
}

function newInnovation () {
        pool.innovation = pool.innovation + 1;
        return pool.innovation;
}

function newPool () {
        var pool = {};
        pool.species = [];
        pool.generation = 0;
        pool.innovation = Outputs;
        pool.currentSpecies = 1;
        pool.currentGenome = 1;
        pool.currentFrame = 0;
        pool.maxFitness = 0;

        return pool;
}

function newSpecies () {
        var species = {};
        species.topFitness = 0;
        species.staleness = 0;
        species.genomes = [];
        species.averageFitness = 0;

        return species;
}

function newGenome () {
        var genome = {};
        genome.genes = [];
        genome.fitness = 0;
        genome.adjustedFitness = 0;
        genome.network = [];
        genome.maxneuron = 0;
        genome.globalRank = 0;
        genome.mutationRates = {};
        genome.mutationRates["connections"] = MutateConnectionsChance;
        genome.mutationRates["link"] = LinkMutationChance;
        genome.mutationRates["bias"] = BiasMutationChance;
        genome.mutationRates["node"] = NodeMutationChance;
        genome.mutationRates["enable"] = EnableMutationChance;
        genome.mutationRates["disable"] = DisableMutationChance;
        genome.mutationRates["step"] = StepSize;

        return genome;
}

function copyGenome (genome) {
        var genome2 = newGenome();
        for (g=1; g<genome.genes.length; g++) {
                genome2.genes.push( copyGene(genome.genes[g]) );
        }
        genome2.maxneuron = genome.maxneuron;
        genome2.mutationRates["connections"] = genome.mutationRates["connections"];
        genome2.mutationRates["link"] = genome.mutationRates["link"];
        genome2.mutationRates["bias"] = genome.mutationRates["bias"];
        genome2.mutationRates["node"] = genome.mutationRates["node"];
        genome2.mutationRates["enable"] = genome.mutationRates["enable"];
        genome2.mutationRates["disable"] = genome.mutationRates["disable"];

        return genome2;
}

function basicGenome () {
        var genome = newGenome();
        var innovation = 1;

        genome.maxneuron = Inputs;
        mutate(genome);

        return genome;
}

function newGene () {
        var gene = {};
        gene.into = 0;
        gene.out = 0;
        gene.weight = 0.0;
        gene.enabled = true;
        gene.innovation = 0;

        return gene;
}

function copyGene (gene) {
        var gene2 = newGene();
        gene2.into = gene.into;
        gene2.out = gene.out;
        gene2.weight = gene.weight;
        gene2.enabled = gene.enabled;
        gene2.innovation = gene.innovation;

        return gene2;
}

function newNeuron () {
        var neuron = {};
        neuron.incoming = [];
        neuron.value = 0.0;

        return neuron;
}

function generateNetwork (genome) {
        var network = {};
        network.neurons = [];

        for (i=1; i<Inputs; i++) {
                network.neurons[i] = newNeuron();
        }

        for (o=1; o<Outputs; o++) {
                network.neurons[MaxNodes+o] = newNeuron();
        }

        genome.genes.sort(function (a, b) {
                return (a.out - b.out);
        })
        for (i=1; i<genome.genes.length; i++) {
                var gene = genome.genes[i];
                if (gene.enabled) {
                        if ( isEmpty(network.neurons[gene.out]) ) {
                                network.neurons[gene.out] = newNeuron();
                        }
                        var neuron = network.neurons[gene.out];
                        neuron.incoming.push(gene);
                        if ( isEmpty(network.neurons[gene.into]) ) {
                                network.neurons[gene.into] = newNeuron();
                        }
                }
        }

        genome.network = network;
}

function evaluateNetwork (network, inputs) {
        var outputs = {};

        inputs.push(1);
        if (inputs.length != Inputs) {
                console.log("Incorrect number of neural network inputs.");
                return outputs;
        }

        for (i=1; i<Inputs; i++) {
                network.neurons[i].value = inputs[i];
        }

        for (_=0; _<network.neurons; _++) {
                var neuron = network.neurons[_];
                var sum = 0;
                for (j = 1; j<neuron.incoming.length; j++) {
                        var incoming = neuron.incoming[j];
                        var other = network.neurons[incoming.into];
                        sum = sum + incoming.weight * other.value;
                }

                if (neuron.incoming.length > 0) {
                        neuron.value = sigmoid(sum);
                }
        }

        for (o=1; o<Outputs; o++) {
                var button = "P1 " + ButtonNames[o];
                if (network.neurons[MaxNodes+o].value > 0) {
                        outputs[button] = true;
                } else {
                        outputs[button] = false;
                }
        }

        return outputs;
}

function crossover (g1, g2) {
        // Make sure g1 is the higher fitness genome
        if (g2.fitness > g1.fitness) {
                tempg = g1;
                g1 = g2;
                g2 = tempg;
        }

        var child = newGenome();

        var innovations2 = {};
        for (i=1; i<g2.genes.length; i++) {
                var gene = g2.genes[i];
                innovations2[gene.innovation] = gene;
        }

        for (i=1; i<g1.genes.length; i++) {
                var gene1 = g1.genes[i];
                var gene2 = innovations2[gene1.innovation];
                if (gene2 != null && Math.random(2) == 1 && gene2.enabled) {
                        child.genes.concat( copyGene(gene2) );
                } else {
                        child.genes.concat( copyGene(gene1) );
                }
        }

        child.maxneuron = Math.max(g1.maxneuron,g2.maxneuron);

        for (mutation=0; mutation<g1.mutationRates; mutation++) {
                var rate = g1.mutationRates[mutation];
                child.mutationRates[mutation] = rate;
        }

        return child;
}

function randomNeuron (genes, nonInput) {
        var neurons = [];
        if ( !nonInput ) {
                for (i=1; i<Inputs; i++) {
                        neurons[i] = true;
                }
        }
        for (o=1; o<Outputs; o++) {
                neurons[MaxNodes+o] = true;
        }
        for (i=1; i<genes.length; i++) {
                if ( !nonInput || genes[i].into > Inputs) {
                        neurons[genes[i].into] = true;
                }
                if ( !nonInput || genes[i].out > Inputs) {
                        neurons[genes[i].out] = true;
                }
        }

        var count = 0;
        for (_=0; _<neurons; _++) {
                count = count + 1;
        }
        var n = Math.random(1, count);

        for (k=0; k<neurons; k++) {
                var v = neurons[k];
                n = n-1;
                if (n == 0) {
                        return k;
                }
        }

        return 0;
}

function containsLink (genes, link) {
        for (i=1; i<genes.length; i++) {
                var gene = genes[i];
                if (gene.into == link.into && gene.out == link.out) {
                        return true;
                }
        }
}

function pointMutate (genome) {
        var step = genome.mutationRates["step"];

        for (i=1; i<genome.genes.length; i++) {
                var gene = genome.genes[i];
                if (Math.random() < PerturbChance) {
                        gene.weight = gene.weight + Math.random() * step*2 - step;
                } else {
                        gene.weight = Math.random()*4-2;
                }
        }
}

function linkMutate (genome, forceBias) {
        var neuron1 = randomNeuron(genome.genes, false);
        var neuron2 = randomNeuron(genome.genes, true);

        var newLink = newGene();
        if (neuron1 <= Inputs && neuron2 <= Inputs) {
                // Both input nodes
                return;
        }
        if (neuron2 <= Inputs) {
                // Swap output and input
                var temp = neuron1;
                neuron1 = neuron2;
                neuron2 = temp;
        }

        newLink.into = neuron1;
        newLink.out = neuron2;
        if (forceBias) {
                newLink.into = Inputs;
        }

        if ( containsLink(genome.genes, newLink) ) {
                return;
        }
        newLink.innovation = newInnovation();
        newLink.weight = Math.random()*4-2;

        genome.genes.concat(newLink);
}

function nodeMutate (genome) {
        if (genome.genes.length == 0) {
                return;
        }

        genome.maxneuron = genome.maxneuron + 1;

        var gene = genome.genes[Math.random(1,genome.genes.length)];
        if ( !gene || !gene.enabled ) {
                return;
        }
        gene.enabled = false;

        var gene1 = copyGene(gene);
        gene1.out = genome.maxneuron;
        gene1.weight = 1.0;
        gene1.innovation = newInnovation();
        gene1.enabled = true;
        genome.genes.concat(gene1);

        var gene2 = copyGene(gene);
        gene2.into = genome.maxneuron;
        gene2.innovation = newInnovation();
        gene2.enabled = true;
        genome.genes.concat(gene2);
}

function enableDisableMutate (genome, enable) {
        var candidates = [];
        for (_=0; _<genome.genes; _++) {
                var gene = genome.genes[_];
                if (gene.enabled == !enable) {
                        candidates.concat(gene);
                }
        }

        if (candidates.length == 0) {
                return;
        }

        var gene = candidates[Math.random(1,candidates.length)];

        if ( !gene ) return;

        gene.enabled = !gene.enabled;
}

function mutate (genome) {
        for (mutation=0; mutation<genome.mutationRates; mutation++) {
                var rate = genome.mutationRates[mutation];
                if (Math.random(1,2) == 1) {
                        genome.mutationRates[mutation] = 0.95*rate;
                } else {
                        genome.mutationRates[mutation] = 1.05263*rate;
                }
        }

        if (Math.random() < genome.mutationRates["connections"]) {
                pointMutate(genome);
        }

        var p = genome.mutationRates["link"];
        while (p > 0) {
                if (Math.random() < p) {
                        linkMutate(genome, false);
                }
                p = p - 1;
        }

        p = genome.mutationRates["bias"];
        while (p > 0) {
                if (Math.random() < p) {
                        linkMutate(genome, true);
                }
                p = p - 1;
        }

        p = genome.mutationRates["node"];
        while (p > 0) {
                if (Math.random() < p) {
                        nodeMutate(genome);
                }
                p = p - 1;
        }

        p = genome.mutationRates["enable"]
        while (p > 0) {
                if (Math.random() < p) {
                        enableDisableMutate(genome, true);
                }
                p = p - 1;
        }

        p = genome.mutationRates["disable"]
        while (p > 0) {
                if (Math.random() < p) {
                        enableDisableMutate(genome, false);
                }
                p = p - 1;
        }
}

function disjoint (genes1, genes2) {
        var i1 = [];
        for (i = 1; i <genes1.length; i ++) {
                var gene = genes1[i];
                i1[gene.innovation] = true;
        }

        var i2 = [];
        for (i = 1; i <genes2.length; i ++) {
                var gene = genes2[i];
                i2[gene.innovation] = true;
        }

        var disjointGenes = 0;
        for (i = 1; i <genes1.length; i ++) {
                var gene = genes1[i];
                if (!i2[gene.innovation]) {
                        disjointGenes = disjointGenes+1;
                }
        }

        for (i = 1; i <genes2.length; i ++) {
                var gene = genes2[i];
                if (!i1[gene.innovation]) {
                        disjointGenes = disjointGenes+1;
                }
        }

        var n = Math.max(genes1.length, genes2.length);

        return disjointGenes / n;
}

function weights (genes1, genes2) {
        var i2 = [];
        for (i = 1; i <genes2.length; i ++) {
                var gene = genes2[i];
                i2[gene.innovation] = gene;
        }

        var sum = 0;
        var coincident = 0;
        for (i = 1; i <genes1.length; i ++) {
                var gene = genes1[i];
                if (i2[gene.innovation] != null) {
                        var gene2 = i2[gene.innovation];
                        sum = sum + Math.abs(gene.weight - gene2.weight);
                        coincident = coincident + 1;
                }
        }

        return sum / coincident;
}

function sameSpecies (genome1, genome2) {
        var dd = DeltaDisjoint*disjoint(genome1.genes, genome2.genes);
        var dw = DeltaWeights*weights(genome1.genes, genome2.genes);
        return dd + dw < DeltaThreshold;
}

function rankGlobally () {
        var global = [];
        for (s = 1; s <pool.species.length; s ++) {
                var species = pool.species[s];
                for (g = 1; g <species.genomes.length; g ++) {
                        global.concat(species.genomes[g]);
                }
        }
        global.sort(function (a, b) {
                return (a.fitness - b.fitness);
        })

        for (g=1; g<global.length; g++) {
                global[g].globalRank = g;
        }
}

function calculateAverageFitness (species) {
        var total = 0;

        for (g=1; g<species.genomes.length; g++) {
                var genome = species.genomes[g];
                total = total + genome.globalRank;
        }

        species.averageFitness = total / species.genomes.length;
}

function totalAverageFitness () {
        var total = 0;
        for (s = 1; s <pool.species.length; s ++) {
                var species = pool.species[s];
                total = total + species.averageFitness;
        }

        return total;
}

function cullSpecies (cutToOne) {
        for (s = 1; s <pool.species.length; s ++) {
                var species = pool.species[s];

                species.genomes.sort(function (a, b) {
                        return (b.fitness - a.fitness);
                })

                var remaining = Math.ceil(species.genomes.length/2);
                if (cutToOne) {
                        remaining = 1;
                }
                while (species.genomes.length > remaining) {
                        species.genomes.pop();
                }
        }
}

function breedChild (species) {
        var child = {};
        if (Math.random() < CrossoverChance) {
                g1 = species.genomes[Math.random(1, species.genomes.length)];
                g2 = species.genomes[Math.random(1, species.genomes.length)];
                child = crossover(g1, g2);
        } else {
                g = species.genomes[Math.random(1, species.genomes.length)];
                child = copyGenome(g);
        }

        mutate(child);

        return child;
}

function removeStaleSpecies () {
        var survived = [];

        for (s = 1; s <pool.species.length; s ++) {
                var species = pool.species[s];

                species.genomes.sort(function (a, b) {
                        return (b.fitness - a.fitness);
                })

                if (species.genomes[1].fitness > species.topFitness) {
                        species.topFitness = species.genomes[1].fitness;
                        species.staleness = 0;
                } else {
                        species.staleness = species.staleness + 1;
                }
                if (species.staleness < StaleSpecies || species.topFitness >= pool.maxFitness) {
                        survived.concat(species);
                }
        }

        pool.species = survived;
}

function removeWeakSpecies () {
        var survived = [];

        var sum = totalAverageFitness();
        for (s = 1; s <pool.species.length; s ++) {
                var species = pool.species[s];
                breed = Math.floor(species.averageFitness / sum * Population);
                if (breed >= 1) {
                        survived.concat(species);
                }
        }

        pool.species = survived;
}

function addToSpecies (child) {
        var foundSpecies = false;
        for (s=1; s<pool.species.length; s++) {
                var species = pool.species[s];
                if ( !foundSpecies && sameSpecies(child, species.genomes[1]) ) {
                        species.genomes.concat(child);
                        foundSpecies = true;
                }
        }

        if (!foundSpecies) {
                var childSpecies = newSpecies();
                childSpecies.genomes.concat(child);
                pool.species.concat(childSpecies);
        }
}

function newGeneration () {
        cullSpecies(false); // Cull the bottom half of each species
        rankGlobally();
        removeStaleSpecies();
        rankGlobally();
        for (s = 1; s<pool.species.length; s++) {
                var species = pool.species[s];
                calculateAverageFitness(species);
        }
        removeWeakSpecies();
        var sum = totalAverageFitness();
        var children = [];
        for (s = 1; s<pool.species.length; s++) {
                var species = pool.species[s];
                breed = Math.floor(species.averageFitness / sum * Population) - 1;
                for (i=1; i<breed; i++) {
                        children.concat( breedChild(species) );
                }
        }
        cullSpecies(true); // Cull all but the top member of each species
        while (children.length + pool.species.length < Population) {
                var species = pool.species[Math.random(1, pool.species.length)];
                children.concat( breedChild(species) );
        }
        for (c=1; c<children.length; c++) {
                var child = children[c];
                addToSpecies(child);
        }

        pool.generation = pool.generation + 1;

        writeFile("backup." + pool.generation + "." + forms.gettext(saveLoadFile)); // review
}

function initializePool () {
        pool = newPool();

        for (i=1; i<Population; i++) {
                basic = basicGenome();
                addToSpecies(basic);
        }

        initializeRun();
}

function clearJoypad () {
        controller = {};
        for (b = 1; b<ButtonNames.length; b++) {
                controller["P1 " + ButtonNames[b]] = false;
        }
        joypad.set(controller);
}

function initializeRun () {
        savestate.load(Filename);
        rightmost = 0;
        pool.currentFrame = 0;
        timeout = TimeoutConstant;
        clearJoypad();

        var species = pool.species[pool.currentSpecies];
        var genome = species.genomes[pool.currentGenome];
        generateNetwork(genome);
        evaluateCurrent();
}

function evaluateCurrent() {
        var species = pool.species[pool.currentSpecies];
        var genome = species.genomes[pool.currentGenome];

        inputs = getInputs();
        controller = evaluateNetwork(genome.network, inputs);

        if (controller["P1 Left"] && controller["P1 Right"]) {
                controller["P1 Left"] = false;
                controller["P1 Right"] = false;
        }
        if (controller["P1 Up"] && controller["P1 {wn"]) {
                controller["P1 Up"] = false;
                controller["P1 {wn"] = false;
        }

        joypad.set(controller);
}


function nextGenome () {
        pool.currentGenome = pool.currentGenome + 1;
        if (pool.currentGenome > pool.species[pool.currentSpecies].genomes.length) {
                pool.currentGenome = 1;
                pool.currentSpecies = pool.currentSpecies+1;
                if (pool.currentSpecies > pool.species.length) {
                        newGeneration();
                        pool.currentSpecies = 1;
                }
        }
}

function fitnessAlreadyMeasured () {
        var species = pool.species[pool.currentSpecies];
        var genome = species.genomes[pool.currentGenome];

        return genome.fitness != 0;
}

function displayGenome (genome) {
        var network = genome.network;
        var cells = [];
        var i = 1;
        var cell = {};
        for (dy=-BoxRadius; dy<BoxRadius; dy++) {
                for (dx=-BoxRadius; dx<BoxRadius; dx++) {
                        cell = {};
                        cell.x = 50+5*dx;
                        cell.y = 70+5*dy;
                        cell.value = network.neurons[i].value;
                        cells[i] = cell;
                        i = i + 1;
                }
        }
        var biasCell = {};
        biasCell.x = 80;
        biasCell.y = 110;
        biasCell.value = network.neurons[Inputs].value;
        cells[Inputs] = biasCell;

        for (o = 1; o<Outputs; o++) {
                cell = {};
                cell.x = 220;
                cell.y = 30 + 8 * o;
                cell.value = network.neurons[MaxNodes + o].value;
                cells[MaxNodes+o] = cell;
                var color;
                if (cell.value > 0) {
                        color = 0xFF0000FF;
                } else {
                        color = 0xFF000000;
                }
                gui.drawText(223, 24+8*o, ButtonNames[o], color, 9);
        }

        for (n = 0; n < network.neurons.length; n++) {
                var neuron = network.neurons[n];
                cell = {};
                if (n > Inputs && n <= MaxNodes) {
                        cell.x = 140;
                        cell.y = 40;
                        cell.value = neuron.value;
                        cells[n] = cell;
                }
        }

        for (n=1; n<4; n++) {
                for (_ = 0; _ < genome.genes.length; _++) {
                        var gene = genome.genes[_];
                        if (gene.enabled) {
                                var c1 = cells[gene.into];
                                var c2 = cells[gene.out];
                                if (gene.into > Inputs && gene.into <= MaxNodes) {
                                        c1.x = 0.75*c1.x + 0.25*c2.x;
                                        if (c1.x >= c2.x) {
                                                c1.x = c1.x - 40;
                                        }
                                        if (c1.x < 90) {
                                                c1.x = 90;
                                        }

                                        if (c1.x > 220) {
                                                c1.x = 220;
                                        }
                                        c1.y = 0.75*c1.y + 0.25*c2.y;

                                }
                                if (gene.out > Inputs && gene.out <= MaxNodes) {
                                        c2.x = 0.25*c1.x + 0.75*c2.x;
                                        if (c1.x >= c2.x) {
                                                c2.x = c2.x + 40;
                                        }
                                        if (c2.x < 90) {
                                                c2.x = 90;
                                        }
                                        if (c2.x > 220) {
                                                c2.x = 220;
                                        }
                                        c2.y = 0.25*c1.y + 0.75*c2.y;
                                }
                        }
                }
        }

        gui.drawBox(50-BoxRadius*5-3,70-BoxRadius*5-3,50+BoxRadius*5+2,70+BoxRadius*5+2,0xFF000000, 0x80808080);
        for (n=0; n<cells.length; n++) {
                var cell = cells[n];
                if (n > Inputs || cell.value != 0) {
                        var color = Math.floor((cell.value+1)/2*256);
                        if (color > 255) { color = 255 };
                        if (color < 0) { color = 0 };
                        var opacity = 0xFF000000;
                        if (cell.value == 0) {
                                opacity = 0x50000000;
                        }
                        color = opacity + color*0x10000 + color*0x100 + color;
                        gui.drawBox(cell.x-2,cell.y-2,cell.x+2,cell.y+2,opacity,color);
                }
        }
        for (_=0; _<genome.genes.length; _++) {
                var gene = genome.genes[_];
                if (gene.enabled) {
                        var c1 = cells[gene.into];
                        var c2 = cells[gene.out];
                        var opacity = 0xA0000000;
                        if (c1.value == 0) {
                                opacity = 0x20000000;
                        }

                        var color = 0x80-Math.floor(Math.abs(sigmoid(gene.weight))*0x80);
                        if (gene.weight > 0) {
                                color = opacity + 0x8000 + 0x10000*color;
                        } else {
                                color = opacity + 0x800000 + 0x100*color;
                        }
                        gui.drawLine(c1.x+1, c1.y, c2.x-3, c2.y, color);
                }
        }

        gui.drawBox(49,71,51,78,0x00000000,0x80FF0000);

        if (forms.ischecked(showMutationRates)) {
                var pos = 100;
                for (mutation=0; mutation<genome.mutationRates.length; mutation++) {
                        var rate = genome.mutationRates[mutation];
                        gui.drawText(100, pos, mutation + ": " + rate, 0xFF000000, 10);
                        pos = pos + 8;
                }
        }
}

function playTop () {
        var maxfitness = 0;
        var maxs, maxg;
        for (s=0; s<pool.species.length; s++) {
                var species = pool.species[s];
                for (g=0; g<species.genomes.length; g++) {
                        var genome = species.genomes[g];
                        if (genome.fitness > maxfitness) {
                                maxfitness = genome.fitness;
                                maxs = s;
                                maxg = g;
                        }
                }
        }

        pool.currentSpecies = maxs;
        pool.currentGenome = maxg;
        pool.maxFitness = maxfitness;
        forms.settext(maxFitnessLabel, "Max Fitness: " + Math.floor(pool.maxFitness));
        initializeRun();
        pool.currentFrame = pool.currentFrame + 1;
        return;
}

function onExit () {
//        forms.destroy(form)
}
