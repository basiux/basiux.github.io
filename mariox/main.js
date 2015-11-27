if ( isEmpty(pool) ) {
        initializePool();
}

// writeFile("temp.pool") // review - removed for testing, due to slow compression

//event.onexit(onExit) // review

createForm();

keepMaxFitnessUpdated(); // just in case

setInterval(function asyncInfiniteLoop () {
        var backgroundColor = 0xD0FFFFFF;
        if (!$form.find('input#hideBanner')[0].checked) {
                gui.drawBox(0, 0, 300, 26, backgroundColor, backgroundColor);
        }

        var species = pool.species[pool.currentSpecies];
        var genome = species.genomes[pool.currentGenome];

        if ($form.find('input#showNetwork')[0].checked) {
                displayGenome(genome);
        }

        if (pool.currentFrame%5 == 0) {
                evaluateCurrent();
        }

        joypadSet(controller);

        getPositions();
        if (marioX > rightmost) {
                rightmost = marioX;
                timeout = TimeoutConstant;
        }

        timeout = timeout - 1;


        var timeoutBonus = pool.currentFrame / 4;
        if (timeout + timeoutBonus <= 0) {
                var fitness = rightmost - pool.currentFrame / 2;
                if (rightmost > 3186) {
                        fitness = fitness + 1000;
                }
                if (fitness == 0) {
                        fitness = -1;
                }
                genome.fitness = fitness;

                if (fitness > pool.maxFitness) {
                        pool.maxFitness = fitness;
                        $form.find('input#maxFitness').val(Math.floor(pool.maxFitness));
                        writeFile( "backup." + pool.generation + "." + $form.find('input#saveLoadFile').val() );
                }

                console.log("Gen " + pool.generation + " species " + pool.currentSpecies + " genome " + pool.currentGenome + " fitness: " + fitness);
                pool.currentSpecies = 0; // review 1 or 0
                pool.currentGenome = 0; // review 1 or 0
                while ( fitnessAlreadyMeasured() ) {
                        nextGenome();
                }
                initializeRun();
        }

        var measured = 0;
        var total = 0;
        for (var s in pool.species) { // in pairs
                var species = pool.species[s];
                for (var g in species.genomes) { // in pairs
                        var genome = species.genomes[g];
                        total = total + 1;
                        if (genome.fitness != 0) {
                                measured = measured + 1;
                        }
                }
        }
        if (!$form.find('input#hideBanner')[0].checked) {
                gui.drawText(0, 0, "Gen " + pool.generation + " species " + pool.currentSpecies + " genome " + pool.currentGenome + " (" + math.floor(measured/total*100) + "%)", 0xFF000000, 11);
                gui.drawText(0, 12, "Fitness: " + math.floor(rightmost - (pool.currentFrame) / 2 - (timeout + timeoutBonus)*2/3), 0xFF000000, 11);
                gui.drawText(100, 12, "Max Fitness: " + math.floor(pool.maxFitness), 0xFF000000, 11);
        }

        pool.currentFrame = pool.currentFrame + 1;

        //emu.frameadvance(); // review - hopefully not needed
}, 1); // async infinite loop equivalent
