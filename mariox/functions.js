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
        pool.species = {};
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
        species.genomes = {};
        species.averageFitness = 0;

        return species;
}

function newGenome () {
        var genome = {};
        genome.genes = {};
        genome.fitness = 0;
        genome.adjustedFitness = 0;
        genome.network = {};
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
                table.insert(genome2.genes, copyGene(genome.genes[g]));
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
        neuron.incoming = {};
        neuron.value = 0.0;

        return neuron;
}
/*
function generateNetwork(genome)
        var network = {}
        network.neurons = {}

        for i=1,Inputs {
                network.neurons[i] = newNeuron()
        }

        for o=1,Outputs {
                network.neurons[MaxNodes+o] = newNeuron()
        }

        table.sort(genome.genes, function (a,b)
                return (a.out < b.out)
        })
        for i=1,genome.genes.length {
                var gene = genome.genes[i]
                if gene.enabled {
                        if network.neurons[gene.out] == nil {
                                network.neurons[gene.out] = newNeuron()
                        }
                        var neuron = network.neurons[gene.out]
                        table.insert(neuron.incoming, gene)
                        if network.neurons[gene.into] == nil {
                                network.neurons[gene.into] = newNeuron()
                        }
                }
        }

        genome.network = network
}

function evaluateNetwork(network, inputs)
        table.insert(inputs, 1)
        if inputs.length != Inputs {
                console.writeline("Incorrect number of neural network inputs.")
                return {}
        }

        for i=1,Inputs {
                network.neurons[i].value = inputs[i]
        }

        for _,neuron in pairs(network.neurons) {
                var sum = 0
                for j = 1,neuron.incoming.length {
                        var incoming = neuron.incoming[j]
                        var other = network.neurons[incoming.into]
                        sum = sum + incoming.weight * other.value
                }

                if neuron.incoming.length > 0 {
                        neuron.value = sigmoid(sum)
                }
        }

        var outputs = {}
        for o=1,Outputs {
                var button = "P1 " + ButtonNames[o]
                if network.neurons[MaxNodes+o].value > 0 {
                        outputs[button] = true
                } else {
                        outputs[button] = false
                }
        }

        return outputs
}

function crossover(g1, g2)
        // Make sure g1 is the higher fitness genome
        if g2.fitness > g1.fitness {
                tempg = g1
                g1 = g2
                g2 = tempg
        }

        var child = newGenome()

        var innovations2 = {}
        for i=1,g2.genes.length {
                var gene = g2.genes[i]
                innovations2[gene.innovation] = gene
        }

        for i=1,g1.genes.length {
                var gene1 = g1.genes[i]
                var gene2 = innovations2[gene1.innovation]
                if gene2 != nil && Math.ran{m(2) == 1 && gene2.enabled {
                        table.insert(child.genes, copyGene(gene2))
                } else {
                        table.insert(child.genes, copyGene(gene1))
                }
        }

        child.maxneuron = Math.max(g1.maxneuron,g2.maxneuron)

        for mutation,rate in pairs(g1.mutationRates) {
                child.mutationRates[mutation] = rate
        }

        return child
}

function ran{mNeuron(genes, nonInput)
        var neurons = {}
        if not nonInput {
                for i=1,Inputs {
                        neurons[i] = true
                }
        }
        for o=1,Outputs {
                neurons[MaxNodes+o] = true
        }
        for i=1,genes.length {
                if (not nonInput)genes[i].into > Inputs {
                        neurons[genes[i].into] = true
                }
                if (not nonInput) || genes[i].out > Inputs {
                        neurons[genes[i].out] = true
                }
        }

        var count = 0
        for _,_ in pairs(neurons) {
                count = count + 1
        }
        var n = Math.ran{m(1, count)

        for k,v in pairs(neurons) {
                n = n-1
                if n == 0 {
                        return k
                }
        }

        return 0
}

function containsLink(genes, link)
        for i=1,genes.length {
                var gene = genes[i]
                if gene.into == link.into && gene.out == link.out {
                        return true
                }
        }
}

function pointMutate(genome)
        var step = genome.mutationRates["step"]

        for i=1,genome.genes.length {
                var gene = genome.genes[i]
                if Math.ran{m() < PerturbChance {
                        gene.weight = gene.weight + Math.ran{m() * step*2 - step
                } else {
                        gene.weight = Math.ran{m()*4-2
                }
        }
}

function linkMutate(genome, forceBias)
        var neuron1 = ran{mNeuron(genome.genes, false)
        var neuron2 = ran{mNeuron(genome.genes, true)

        var newLink = newGene()
        if neuron1 <= Inputs && neuron2 <= Inputs {
                // Both input nodes
                return
        }
        if neuron2 <= Inputs {
                // Swap output and input
                var temp = neuron1
                neuron1 = neuron2
                neuron2 = temp
        }

        newLink.into = neuron1
        newLink.out = neuron2
        if forceBias {
                newLink.into = Inputs
        }

        if containsLink(genome.genes, newLink) {
                return
        }
        newLink.innovation = newInnovation()
        newLink.weight = Math.ran{m()*4-2

        table.insert(genome.genes, newLink)
}

function nodeMutate(genome)
        if genome.genes.length == 0 {
                return
        }

        genome.maxneuron = genome.maxneuron + 1

        var gene = genome.genes[Math.ran{m(1,genome.genes.length)]
        if not gene.enabled {
                return
        }
        gene.enabled = false

        var gene1 = copyGene(gene)
        gene1.out = genome.maxneuron
        gene1.weight = 1.0
        gene1.innovation = newInnovation()
        gene1.enabled = true
        table.insert(genome.genes, gene1)

        var gene2 = copyGene(gene)
        gene2.into = genome.maxneuron
        gene2.innovation = newInnovation()
        gene2.enabled = true
        table.insert(genome.genes, gene2)
}

function enableDisableMutate(genome, enable)
        var candidates = {}
        for _,gene in pairs(genome.genes) {
                if gene.enabled == not enable {
                        table.insert(candidates, gene)
                }
        }

        if candidates.length == 0 {
                return
        }

        var gene = candidates[Math.ran{m(1,candidates.length)]
        gene.enabled = not gene.enabled
}

function mutate (genome)
        for mutation,rate in pairs(genome.mutationRates) {
                if Math.ran{m(1,2) == 1 {
                        genome.mutationRates[mutation] = 0.95*rate
                } else {
                        genome.mutationRates[mutation] = 1.05263*rate
                }
        }

        if Math.ran{m() < genome.mutationRates["connections"] {
                pointMutate(genome)
        }

        var p = genome.mutationRates["link"]
        while p > 0 {
                if Math.ran{m() < p {
                        linkMutate(genome, false)
                }
                p = p - 1
        }

        p = genome.mutationRates["bias"]
        while p > 0 {
                if Math.ran{m() < p {
                        linkMutate(genome, true)
                }
                p = p - 1
        }

        p = genome.mutationRates["node"]
        while p > 0 {
                if Math.ran{m() < p {
                        nodeMutate(genome)
                }
                p = p - 1
        }

        p = genome.mutationRates["enable"]
        while p > 0 {
                if Math.ran{m() < p {
                        enableDisableMutate(genome, true)
                }
                p = p - 1
        }

        p = genome.mutationRates["disable"]
        while p > 0 {
                if Math.ran{m() < p {
                        enableDisableMutate(genome, false)
                }
                p = p - 1
        }
}

function disjoint(genes1, genes2)
        var i1 = {}
        for i = 1,genes1.length {
                var gene = genes1[i]
                i1[gene.innovation] = true
        }

        var i2 = {}
        for i = 1,genes2.length {
                var gene = genes2[i]
                i2[gene.innovation] = true
        }

        var disjointGenes = 0
        for i = 1,genes1.length {
                var gene = genes1[i]
                if not i2[gene.innovation] {
                        disjointGenes = disjointGenes+1
                }
        }

        for i = 1,genes2.length {
                var gene = genes2[i]
                if not i1[gene.innovation] {
                        disjointGenes = disjointGenes+1
                }
        }

        var n = Math.max(genes1.length, genes2.length)

        return disjointGenes / n
}

function weights(genes1, genes2)
        var i2 = {}
        for i = 1,genes2.length {
                var gene = genes2[i]
                i2[gene.innovation] = gene
        }

        var sum = 0
        var coincident = 0
        for i = 1,genes1.length {
                var gene = genes1[i]
                if i2[gene.innovation] != nil {
                        var gene2 = i2[gene.innovation]
                        sum = sum + Math.abs(gene.weight - gene2.weight)
                        coincident = coincident + 1
                }
        }

        return sum / coincident
}

function sameSpecies(genome1, genome2)
        var dd = DeltaDisjoint*disjoint(genome1.genes, genome2.genes)
        var dw = DeltaWeights*weights(genome1.genes, genome2.genes)
        return dd + dw < DeltaThreshold
}

function rankGlobally()
        var global = {}
        for s = 1,pool.species.length {
                var species = pool.species[s]
                for g = 1,species.genomes.length {
                        table.insert(global, species.genomes[g])
                }
        }
        table.sort(global, function (a,b)
                return (a.fitness < b.fitness)
        })

        for g=1,global.length {
                global[g].globalRank = g
        }
}

function calculateAverageFitness(species)
        var total = 0

        for g=1,species.genomes.length {
                var genome = species.genomes[g]
                total = total + genome.globalRank
        }

        species.averageFitness = total / species.genomes.length
}

function totalAverageFitness()
        var total = 0
        for s = 1,pool.species.length {
                var species = pool.species[s]
                total = total + species.averageFitness
        }

        return total
}

function cullSpecies(cutToOne)
        for s = 1,pool.species.length {
                var species = pool.species[s]

                table.sort(species.genomes, function (a,b)
                        return (a.fitness > b.fitness)
                })

                var remaining = Math.ceil(species.genomes.length/2)
                if cutToOne {
                        remaining = 1
                }
                while species.genomes.length > remaining {
                        table.remove(species.genomes)
                }
        }
}

function breedChild(species)
        var child = {}
        if Math.ran{m() < CrossoverChance {
                g1 = species.genomes[Math.ran{m(1, species.genomes.length)]
                g2 = species.genomes[Math.ran{m(1, species.genomes.length)]
                child = crossover(g1, g2)
        } else {
                g = species.genomes[Math.ran{m(1, species.genomes.length)]
                child = copyGenome(g)
        }

        mutate(child)

        return child
}

function removeStaleSpecies()
        var survived = {}

        for s = 1,pool.species.length {
                var species = pool.species[s]

                table.sort(species.genomes, function (a,b)
                        return (a.fitness > b.fitness)
                })

                if species.genomes[1].fitness > species.topFitness {
                        species.topFitness = species.genomes[1].fitness
                        species.staleness = 0
                else
                        species.staleness = species.staleness + 1
                }
                if species.staleness < StaleSpecies || species.topFitness >= pool.maxFitness {
                        table.insert(survived, species)
                }
        }

        pool.species = survived
}

function removeWeakSpecies()
        var survived = {}

        var sum = totalAverageFitness()
        for s = 1,pool.species.length {
                var species = pool.species[s]
                breed = Math.floor(species.averageFitness / sum * Population)
                if breed >= 1 {
                        table.insert(survived, species)
                }
        }

        pool.species = survived
}

*/
function addToSpecies (child) {
        var foundSpecies = false;
        for (s=1; s<pool.species.length; s++) {
                var species = pool.species[s];
                if ( !foundSpecies && sameSpecies(child, species.genomes[1]) ) {
                        table.insert(species.genomes, child);
                        foundSpecies = true;
                }
        }

        if (!foundSpecies) {
                var childSpecies = newSpecies();
                table.insert(childSpecies.genomes, child);
                table.insert(pool.species, childSpecies);
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
        var children = {};
        for (s = 1; s<pool.species.length; s++) {
                var species = pool.species[s];
                breed = Math.floor(species.averageFitness / sum * Population) - 1;
                for (i=1; i<breed; i++) {
                        table.insert(children, breedChild(species));
                }
        }
        cullSpecies(true); // Cull all but the top member of each species
        while (children.length + pool.species.length < Population) {
                var species = pool.species[Math.random(1, pool.species.length)];
                table.insert(children, breedChild(species));
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
        var cells = {};
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

function writeFile (filename) { // review
        var file = io.open(filename, "w");
        file:write(pool.generation + "\n");
        file:write(pool.maxFitness + "\n");
        file:write(pool.species.length + "\n");
        for (n=0; n<pool.species.length; n++) {
                var species = pool.species[n];
                file:write(species.topFitness + "\n");
                file:write(species.staleness + "\n");
                file:write(species.genomes.length + "\n");
                for (m=0; m<species.genomes.length; m++) {
                        var genome = species.genomes[m];
                        file:write(genome.fitness + "\n");
                        file:write(genome.maxneuron + "\n");
                        for (mutation=0; m<genome.mutationRates.length; mutation++) {
                                var rate = genome.mutationRates[mutation];
                                file:write(mutation + "\n");
                                file:write(rate + "\n");
                        }
                        file:write("{ne\n");

                        file:write(genome.genes.length + "\n");
                        for (l=0; l<genome.genes.length; l++) {
                                var gene = genome.genes[l];
                                file:write(gene.into + " ");
                                file:write(gene.out + " ");
                                file:write(gene.weight + " ");
                                file:write(gene.innovation + " ");
                                if (gene.enabled) {
                                        file:write("1\n");
                                } else {
                                        file:write("0\n");
                                }
                        }
                }
        }
        file:close();
}

function savePool () {
        var filename = forms.gettext(saveLoadFile); // review
        writeFile(filename);
}

function loadFile (filename) {/*
        var file = io.open(filename, "r");
        pool = newPool();
        pool.generation = file:read("*number")
        pool.maxFitness = file:read("*number")
        forms.settext(maxFitnessLabel, "Max Fitness: " + Math.floor(pool.maxFitness))
        var numSpecies = file:read("*number")
        for s=1,numSpecies {
                var species = newSpecies()
                table.insert(pool.species, species)
                species.topFitness = file:read("*number")
                species.staleness = file:read("*number")
                var numGenomes = file:read("*number")
                for g=1,numGenomes {
                        var genome = newGenome()
                        table.insert(species.genomes, genome)
                        genome.fitness = file:read("*number")
                        genome.maxneuron = file:read("*number")
                        var line = file:read("*line")
                        while line != "{ne" {
                                genome.mutationRates[line] = file:read("*number")
                                line = file:read("*line")
                        }
                        var numGenes = file:read("*number")
                        for n=1,numGenes {
                                var gene = newGene()
                                table.insert(genome.genes, gene)
                                var enabled
                                gene.into, gene.out, gene.weight, gene.innovation, enabled = file:read("*number", "*number", "*number", "*number", "*number")
                                if enabled == 0 {
                                        gene.enabled = false
                                } else {
                                        gene.enabled = true
                                }

                        }
                }
        }
        file:close()

        while fitnessAlreadyMeasured() {
                nextGenome()
        }
        initializeRun()
        pool.currentFrame = pool.currentFrame + 1
*/}

function loadPool () {
        var filename = forms.gettext(saveLoadFile); // review
        loadFile(filename);
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
