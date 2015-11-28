// this shall be split into a few more files yet

function sigmoid (x) {
        return 2/(1+Math.exp(-4.9*x))-1;
}

function newPool () {
        var pool = {};
        pool.species = [];
        pool.generation = 0;
        pool.innovation = Outputs - 1; // array bonds
        pool.currentSpecies = 0; // array bonds
        pool.currentGenome = 0; // array bonds
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
        for (var g=0; g<genome.genes.length; g++) {
                genome2.genes.push( copyGene(genome.genes[g]) ); // table.insert
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
        //var innovation = 0; // array bonds - probably useless

        genome.maxneuron = Inputs - 1; // array bonds
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

        for (var i=0; i<Inputs; i++) {
                network.neurons[i] = newNeuron();
        }

        for (var o=0; o<Outputs; o++) {
                network.neurons[MaxNodes+o] = newNeuron();
        }

        genome.genes.sort(function (a, b) {
                return (a.out - b.out);
        })
        for (var i=0; i<genome.genes.length; i++) {
                var gene = genome.genes[i];
                if (gene.enabled) {
                        if ( isEmpty(network.neurons[gene.out]) ) {
                                network.neurons[gene.out] = newNeuron();
                        }
                        var neuron = network.neurons[gene.out];
                        neuron.incoming.push(gene); // table.insert
                        if ( isEmpty(network.neurons[gene.into]) ) {
                                network.neurons[gene.into] = newNeuron();
                        }
                }
        }

        genome.network = network;
}

function evaluateNetwork (network, inputs) {
        var outputs = {};

        inputs.push(1); // table.insert
        if (inputs.length != Inputs) {
                console.error("Incorrect number of neural network inputs: "+ inputs.length +" (expected "+ Inputs +")");
                return outputs;
        }

        for (var i=0; i<Inputs; i++) {
                network.neurons[i].value = inputs[i];
        }

        for (var _ in network.neurons) { // in pairs
                var neuron = network.neurons[_];
                var sum = 0;
                for (var j = 0; j<neuron.incoming.length; j++) {
                        var incoming = neuron.incoming[j];
                        var other = network.neurons[incoming.into];
                        sum = sum + incoming.weight * other.value;
                }

                if (neuron.incoming.length > 0) {
                        neuron.value = sigmoid(sum);
                }
        }

        for (var o=0; o<Outputs; o++) {
                var button = "KEY_" + ButtonNames[o];
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
        for (var i=0; i<g2.genes.length; i++) {
                var gene = g2.genes[i];
                innovations2[gene.innovation] = gene;
        }

        for (var i=0; i<g1.genes.length; i++) {
                var gene1 = g1.genes[i];
                var gene2 = innovations2[gene1.innovation];
                if ( !isEmpty(gene2) && mathRandom(2) == 1 && gene2.enabled) {
                        child.genes.push( copyGene(gene2) ); // table.insert
                } else {
                        child.genes.push( copyGene(gene1) ); // table.insert
                }
        }

        child.maxneuron = Math.max(g1.maxneuron,g2.maxneuron);

        for (var mutation in g1.mutationRates) { // in pairs
                var rate = g1.mutationRates[mutation];
                child.mutationRates[mutation] = rate;
        }

        return child;
}

function randomNeuron (genes, nonInput) {
        var neurons = [];
        if ( !nonInput ) {
                for (var i=0; i<Inputs; i++) {
                        neurons[i] = true;
                }
        }
        for (var o=0; o<Outputs; o++) {
                neurons[MaxNodes+o] = true;
        }
        for (var i=0; i<genes.length; i++) {
                if ( !nonInput || genes[i].into >= Inputs) {
                        neurons[genes[i].into] = true;
                }
                if ( !nonInput || genes[i].out >= Inputs) {
                        neurons[genes[i].out] = true;
                }
        }

        var count = 0;
        for (var _ in neurons) { // in pairs
                count = count + 1;
        }
        var n = mathRandom(1, count);

        for (var k in neurons) { // in pairs
                var v = neurons[k];
                n = n-1;
                if (n == 0) {
                        return k;
                }
        }

        return 0;
}

function containsLink (genes, link) {
        for (var i=0; i<genes.length; i++) {
                var gene = genes[i];
                if (gene.into == link.into && gene.out == link.out) {
                        return true;
                }
        }
}

function pointMutate (genome) {
        var step = genome.mutationRates["step"];

        for (var i=0; i<genome.genes.length; i++) {
                var gene = genome.genes[i];
                if (mathRandom() < PerturbChance) {
                        gene.weight = gene.weight + mathRandom() * step*2 - step;
                } else {
                        gene.weight = mathRandom()*4-2;
                }
        }
}

function linkMutate (genome, forceBias) {
        var neuron1 = randomNeuron(genome.genes, false);
        var neuron2 = randomNeuron(genome.genes, true);

        var newLink = newGene();
        if (neuron1 < Inputs && neuron2 < Inputs) { // array bonds
                // Both input nodes
                return;
        }
        if (neuron2 < Inputs) { // array bonds
                // Swap output and input
                var temp = neuron1;
                neuron1 = neuron2;
                neuron2 = temp;
        }

        newLink.into = neuron1;
        newLink.out = neuron2;
        if (forceBias) {
                newLink.into = Inputs - 1; // array bonds
        }

        if ( containsLink(genome.genes, newLink) ) {
                return;
        }
        newLink.innovation = ++pool.innovation;
        newLink.weight = mathRandom()*4-2;

        genome.genes.push(newLink); // table.insert
}

function nodeMutate (genome) {
        if (genome.genes.length == 0) {
                return;
        }

        genome.maxneuron++;

        var gene = genome.genes[mathRandom(1,genome.genes.length)-1];
        if ( !gene || !gene.enabled ) {
                return;
        }
        gene.enabled = false;

        var gene1 = copyGene(gene);
        gene1.out = genome.maxneuron;
        gene1.weight = 1.0;
        gene1.innovation = ++pool.innovation;
        gene1.enabled = true;
        genome.genes.push(gene1); // table.insert

        var gene2 = copyGene(gene);
        gene2.into = genome.maxneuron;
        gene2.innovation = ++pool.innovation;
        gene2.enabled = true;
        genome.genes.push(gene2); // table.insert
}

function enableDisableMutate (genome, enable) {
        var candidates = [];
        for (var _ in genome.genes) { // in pairs
                var gene = genome.genes[_];
                if (gene.enabled == !enable) {
                        candidates.push(gene); // table.insert
                }
        }

        if (candidates.length == 0) {
                return;
        }

        var gene = candidates[mathRandom(1,candidates.length)-1];

        if ( !gene ) return;

        gene.enabled = !gene.enabled;
}

function mutate (genome) {
        for (var mutation in genome.mutationRates) { // in pairs
                var rate = genome.mutationRates[mutation];
                if (mathRandom(1,2) == 1) {
                        genome.mutationRates[mutation] = 0.95*rate;
                } else {
                        genome.mutationRates[mutation] = 1.05263*rate;
                }
        }

        if (mathRandom() < genome.mutationRates["connections"]) {
                pointMutate(genome);
        }

        var p = genome.mutationRates["link"];
        while (p > 0) {
                if (mathRandom() < p) {
                        linkMutate(genome, false);
                }
                p = p - 1;
        }

        p = genome.mutationRates["bias"];
        while (p > 0) {
                if (mathRandom() < p) {
                        linkMutate(genome, true);
                }
                p = p - 1;
        }

        p = genome.mutationRates["node"];
        while (p > 0) {
                if (mathRandom() < p) {
                        nodeMutate(genome);
                }
                p = p - 1;
        }

        p = genome.mutationRates["enable"]
        while (p > 0) {
                if (mathRandom() < p) {
                        enableDisableMutate(genome, true);
                }
                p = p - 1;
        }

        p = genome.mutationRates["disable"]
        while (p > 0) {
                if (mathRandom() < p) {
                        enableDisableMutate(genome, false);
                }
                p = p - 1;
        }
}

function disjoint (genes1, genes2) {
        var i1 = [];
        for (var i = 0; i <genes1.length; i ++) {
                var gene = genes1[i];
                i1[gene.innovation] = true;
        }

        var i2 = [];
        for (var i = 0; i <genes2.length; i ++) {
                var gene = genes2[i];
                i2[gene.innovation] = true;
        }

        var disjointGenes = 0;
        for (var i = 0; i <genes1.length; i ++) {
                var gene = genes1[i];
                if (!i2[gene.innovation]) {
                        disjointGenes = disjointGenes+1;
                }
        }

        for (var i = 0; i <genes2.length; i ++) {
                var gene = genes2[i];
                if (!i1[gene.innovation]) {
                        disjointGenes = disjointGenes+1;
                }
        }

        var n = Math.max(genes1.length-1, genes2.length-1);

        return disjointGenes / n;
}

function weights (genes1, genes2) {
        var i2 = [];
        for (var i = 0; i <genes2.length; i ++) {
                var gene = genes2[i];
                i2[gene.innovation] = gene;
        }

        var sum = 0;
        var coincident = 0;
        for (var i = 0; i <genes1.length; i ++) {
                var gene = genes1[i];
                if ( !isEmpty(i2[gene.innovation]) ) {
                        var gene2 = i2[gene.innovation];
                        sum = sum + Math.abs(gene.weight - gene2.weight);
                        coincident++;
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
        for (var s = 0; s <pool.species.length; s ++) {
                var species = pool.species[s];
                for (var g = 0; g <species.genomes.length; g ++) {
                        global.push(species.genomes[g]); // table.insert
                }
        }
        global.sort(function (a, b) {
                return (a.fitness - b.fitness); // from less to more fit
        })

        for (var g=0; g<global.length; g++) {
                global[g].globalRank = g;
        }
}

function calculateAverageFitness (species) {
        var total = 0;

        for (var g=0; g<species.genomes.length; g++) {
                var genome = species.genomes[g];
                total = total + genome.globalRank;
        }

        species.averageFitness = total / species.genomes.length;
}

function totalAverageFitness () {
        var total = 0;
        for (var s = 0; s <pool.species.length; s ++) {
                var species = pool.species[s];
                total = total + species.averageFitness;
        }

        return total;
}

function cullSpecies (cutToOne) {
        for (var s = 0; s <pool.species.length; s ++) {
                var species = pool.species[s];

                species.genomes.sort(function (a, b) {
                        return (b.fitness - a.fitness);
                })

                var remaining = Math.ceil(species.genomes.length/2);
                if (cutToOne) {
                        remaining = 1; // array bonds
                }
                while (species.genomes.length > remaining) {
                        species.genomes.pop();
                }
        }
}

function breedChild (species) {
        var child = {};
        if (mathRandom() < CrossoverChance) {
                g1 = species.genomes[mathRandom(1, species.genomes.length)-1];
                g2 = species.genomes[mathRandom(1, species.genomes.length)-1];
                child = crossover(g1, g2);
        } else {
                g = species.genomes[mathRandom(1, species.genomes.length)-1];
                child = copyGenome(g);
        }

        mutate(child);

        return child;
}

function removeStaleSpecies () {
        var survived = [];

        for (var s = 0; s <pool.species.length; s ++) {
                var species = pool.species[s];

                species.genomes.sort(function (a, b) {
                        return (b.fitness - a.fitness);
                })

                if (species.genomes[0].fitness > species.topFitness) { // array bonds
                        species.topFitness = species.genomes[0].fitness; // array bonds
                        species.staleness = 0;
                } else {
                        species.staleness++;
                }
                if (species.staleness < StaleSpecies || species.topFitness >= pool.maxFitness) {
                        survived.push(species); // table.insert
                }
        }

        pool.species = survived;
}

function removeWeakSpecies () {
        var survived = [];

        var sum = totalAverageFitness();
        for (var s = 0; s <pool.species.length; s ++) {
                var species = pool.species[s];
                var breed = Math.floor(species.averageFitness / sum * Population);
                if (breed >= 1) {
                        survived.push(species); // table.insert
                }
        }

        pool.species = survived;
}

function addToSpecies (child) {
        var foundSpecies = false;
        for (var s=0; s<pool.species.length; s++) {
                var species = pool.species[s];
                if ( !foundSpecies && sameSpecies(child, species.genomes[0]) ) { // array bonds
                        species.genomes.push(child); // table.insert
                        foundSpecies = true;
                        break; //for
                }
        }

        if (!foundSpecies) {
                var childSpecies = newSpecies();
                childSpecies.genomes.push(child); // table.insert
                pool.species.push(childSpecies); // table.insert
        }
}

function newGeneration () {
        cullSpecies(false); // Cull the bottom half of each species
        rankGlobally();
        removeStaleSpecies();
        rankGlobally();
        for (var s = 0; s<pool.species.length; s++) {
                var species = pool.species[s];
                calculateAverageFitness(species);
        }
        removeWeakSpecies();
        var sum = totalAverageFitness();
        var children = [];
        for (var s = 0; s<pool.species.length; s++) {
                var species = pool.species[s];
                var breed = Math.floor(species.averageFitness / sum * Population) - 1;
                for (var i=0; i<breed; i++) {
                        children.push( breedChild(species) ); // table.insert
                }
        }
        cullSpecies(true); // Cull all but the top member of each species
        while (children.length + pool.species.length <= Population) {
                var species = pool.species[mathRandom(1, pool.species.length)-1];
                children.push( breedChild(species) ); // table.insert
        }
        for (var c=0; c<children.length; c++) {
                var child = children[c];
                addToSpecies(child);
        }

        pool.generation = pool.generation + 1;

        // review - removed for testing, due to slow compression
        //writeFile("backup." + pool.generation + "." + $form.find('input#saveLoadFile').val());
}

function initializePool () {
        pool = newPool();

        for (var i=0; i<Population; i++) {
                var basic = basicGenome();
                addToSpecies(basic);
        }

        initializeRun();
}

function clearJoypad () {
        controller = {};
        for (var b = 0; b<ButtonNames.length; b++) {
                controller["KEY_" + ButtonNames[b]] = false;
        }
        joypadSet(controller);
}

function initializeRun () {
        // review - probably something like savestate will be needed
        //loadState(Filename); // for now, it can be called just once, or else there's a risk of pause
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

        if (controller["KEY_LEFT"] && controller["KEY_RIGHT"]) {
                controller["KEY_LEFT"] = false;
                controller["KEY_RIGHT"] = false;
        }
        if (controller["KEY_UP"] && controller["KEY_DOWN"]) {
                controller["KEY_UP"] = false;
                controller["KEY_DOWN"] = false;
        }
}


function nextGenome () {
        pool.currentGenome++;
        if (pool.currentGenome >= pool.species[pool.currentSpecies].genomes.length) {
                pool.currentGenome = 0; // array bonds
                pool.currentSpecies++;
                if (pool.currentSpecies >= pool.species.length) {
                        newGeneration();
                        pool.currentSpecies = 0; // array bonds
                }
        }
}

function fitnessAlreadyMeasured () {
        var species = pool.species[pool.currentSpecies];
        var genome = species.genomes[pool.currentGenome];

        return genome.fitness != 0;
}

function playTop () {
        var maxFitness = 0;
        var maxSpecies = 0;
        var maxGenome = 0;
        for (var s in pool.species) { // in pairs
                var species = pool.species[s];
                for (var g in species.genomes) { // in pairs
                        var genome = species.genomes[g];
                        if (genome.fitness > maxFitness) {
                                maxFitness = genome.fitness;
                                maxSpecies = s;
                                maxGenome = g;
                        }
                }
        }

        pool.currentSpecies = maxSpecies;
        pool.currentGenome = maxGenome;
        pool.maxFitness = maxFitness;
        $form.find('input#maxFitness').val(Math.floor(pool.maxFitness));
        initializeRun();
        pool.currentFrame++;
        return;
}
