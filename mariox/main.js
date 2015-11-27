setTimeout(function () {
  simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
}, 2100)

if ( isEmpty(pool) ) {
        initializePool();
}

// writeFile("temp.pool") // review - removed for testing, due to slow compression

//event.onexit(onExit) // review

createAiGUI();

setInterval(function asyncInfiniteLoop () {
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

        $aigui.find('#banner #gen').text( pool.generation + ' species ' + pool.currentSpecies + ' genome ' + pool.currentGenome + ' (' + Math.floor(measured/total*100) + '%)' );
        $aigui.find('#banner #fitness').text( Math.floor(rightmost - (pool.currentFrame) / 2 - (timeout + timeoutBonus)*2/3) );
        $aigui.find('#banner #maxFitness').text( Math.floor(pool.maxFitness) );

        pool.currentFrame = pool.currentFrame + 1;

        //emu.frameadvance(); // review - hopefully not needed
}, 1); // async infinite loop equivalent
