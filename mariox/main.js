//loadState(); // for now, it can be called just once, or else there's a risk of pause

if ( isEmpty(pool) ) {
        initializePool();
}

writeFile("temp.pool")

createAiGUI();

self.nes.stop();
self.nes.isRunning = true;
self.nes.fpsInterval = setInterval(function() {
    self.nes.printFps();
}, self.nes.opts.fpsInterval);

fpsinterval = 0;

mainLoopInterval = setInterval(asyncMainLoop, fpsinterval);

var markDurationInterval = setInterval(markDuration, 1000);
function markDuration () {
  pool.duration += 1/3600; // in hours
  $aigui.find('#banner #duration').text( Math.round(pool.duration * 10000) / 10000 +' hours' );
}

$('#emulator .nes-pause').click(function(){
  if (self.nes.isRunning) {
    mainLoopInterval = setInterval(asyncMainLoop, fpsinterval);
    markDurationInterval = setInterval(markDuration, 1000);
  } else { // pause
    clearInterval(mainLoopInterval);
    clearInterval(markDurationInterval);
  }
});

function asyncMainLoop () { // infinite, async equivalent
        var species = pool.species[pool.currentSpecies];
        var genome = species.genomes[pool.currentGenome];

        var gameClock = getTime();

        // is it in the demo screen?
        if (!isPlayerPlaying() && gameClock == 401) {
          simulate.keyUp(self.nes.keyboard.state1_keys.KEY_START); // make sure it's released
          setTimeout( function () {simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);}, 200 );
        }

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

                        writeFile( "autobackup.fitness." + fitness + "." + $form.find('input#saveLoadFile').val() );
                }

                //console.log("Gen " + pool.generation + " species " + pool.currentSpecies + " genome " + pool.currentGenome + " fitness: " + fitness);
                pool.currentSpecies = 0; // array bonds
                pool.currentGenome = 0; // array bonds
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
                        total++;
                        if (genome.fitness != 0) {
                                measured++;
                        }
                }
        }

        $aigui.find('#banner #gen').text( pool.generation + ' species ' + pool.currentSpecies + ' genome ' + pool.currentGenome + ' (' + Math.floor(measured/total*100) + '%)' );
        $aigui.find('#banner #fitness').text( Math.floor(rightmost - (pool.currentFrame) / 2 - (timeout + timeoutBonus)*2/3) );
        $aigui.find('#banner #maxFitness').text( Math.floor(pool.maxFitness) );

        pool.currentFrame++;

        self.nes.frame();
}
