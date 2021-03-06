if ( isEmpty(pool) ) {
        initializePool();
}

//loadIndexedDB('gameState', loadGameStateCallback);

createAiGUI();

loadFile("autobackup.pool");

self.nes.stop();
self.nes.isRunning = true;
self.nes.fpsInterval = setInterval(function() {
    self.nes.printFps();
}, self.nes.opts.fpsInterval);

// those are currently in the "global" scope, but only being used here
var fpsinterval = 0;
var mainLoopInterval = null;
var markDurationInterval = null;

// review bug
// without this, start button wasn't being activated for some reason
var badFixStartBug = setInterval(function(){ // review bad fix
  $('#emulator .nes-pause').click();
  if (self.nes.isRunning) clearInterval(badFixStartBug);
}, 100); // wait a bit to start main loop

function startMainLoop () {
  mainLoopInterval = setInterval(asyncMainLoop, fpsinterval);
  markDurationInterval = setInterval(markDuration, 1000);
}

function markDuration () {
  pool.duration += 1/3600; // in hours
  $aigui.find('#banner #duration').text( Math.round(pool.duration * 10000) / 10000 +' hours' );
}

$('#emulator .nes-pause').click(function(){
  if (self.nes.isRunning) {
    startMainLoop();
  } else { // pause
    clearInterval(mainLoopInterval);
    clearInterval(markDurationInterval);
  }
});

function manageGameLoop (gameClock) {
  // is it in the ...
  // ... demo screen?
  if (!isPlayerPlaying() && gameClock == 401) {
    clearJoypad(); // took me some time to come up with this new line!!
    simulate.keyUp(self.nes.keyboard.state1_keys.KEY_START); // make sure it's released
    setTimeout(function () {
      simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
    }, 200);
  }

  // ... actual game, with mario alive and ready?
  if (!isMarioReady(gameClock)) {
    return false;
  }

  return true;
}

function manageGameStates (gameClock) {
  // ... beginning of a new game?
  if (isPlayerPlaying() && gameClock < 401 && pool.gameState === null) {
    saveGameState();
  }

  // ... dead?
  if (isPlayerPlaying() && isPlayerObjPause()) {
    if (gameClock < 1) {
      loadGameState();
    }
  }
}

function asyncMainLoop () { // infinite, async equivalent
        var gameClock = getTime();

        if ($form.find('input#showNetwork')[0].checked) {
                displayGenome(pool.species[pool.currentSpecies].genomes[pool.currentGenome]);
        }

        if (manageGameLoop(gameClock)) {
                aiMainLoop();
                manageGameStates(gameClock);
        }

        self.nes.frame();
}

function aiMainLoop () {
        var species = pool.species[pool.currentSpecies];
        var genome = species.genomes[pool.currentGenome];

        if (pool.currentFrame%5 === 0) {
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
                if (fitness === 0) {
                        fitness = -1;
                }
                genome.fitness = fitness;

                if (fitness > pool.maxFitness) {
                        pool.maxFitness = fitness;
                        $form.find('input#maxFitness').val(Math.floor(pool.maxFitness));

                        writeFile( "autobackup.fitness." + fitness + "." + $form.find('input#saveLoadFile').val() );
                        writeFile("autobackup.pool");
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
                var pairSpecies = pool.species[s];
                for (var g in pairSpecies.genomes) { // in pairs
                        var pairGenome = pairSpecies.genomes[g];
                        total++;
                        if (pairGenome.fitness !== 0) {
                                measured++;
                        }
                }
        }

        $aigui.find('#banner #gen').text( pool.generation + ' species ' + pool.currentSpecies + ' genome ' + pool.currentGenome + ' (' + Math.floor(measured/total*100) + '%)' );
        $aigui.find('#banner #fitness').text( Math.floor(rightmost - (pool.currentFrame) / 2 - (timeout + timeoutBonus)*2/3) );
        $aigui.find('#banner #maxFitness').text( Math.floor(pool.maxFitness) );

        pool.currentFrame++;
}
