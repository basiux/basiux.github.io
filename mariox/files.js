function writeFile (filename) { // review
        var file = io.open(filename, "w");
        file:write(pool.generation + "\n");
        file:write(pool.maxFitness + "\n");
        file:write(pool.species.length + "\n");
        for (var n=0; n<pool.species.length; n++) {
                var species = pool.species[n];
                file:write(species.topFitness + "\n");
                file:write(species.staleness + "\n");
                file:write(species.genomes.length + "\n");
                for (var m=0; m<species.genomes.length; m++) {
                        var genome = species.genomes[m];
                        file:write(genome.fitness + "\n");
                        file:write(genome.maxneuron + "\n");
                        for (var mutation=0; m<genome.mutationRates.length; mutation++) {
                                var rate = genome.mutationRates[mutation];
                                file:write(mutation + "\n");
                                file:write(rate + "\n");
                        }
                        file:write("{ne\n");

                        file:write(genome.genes.length + "\n");
                        for (var l=0; l<genome.genes.length; l++) {
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
