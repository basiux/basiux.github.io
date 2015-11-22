// load Mario and controls
$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();
jQuery.getScript("simulate.js");

// this will need to go away soon, as it should be pressed by the Ai
setTimeout( function pressStart () {
  simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
}, 2100);

// Configuration

BoxRadius = 6;
InputSize = (BoxRadius*2+1)*(BoxRadius*2+1);

Inputs = InputSize+1;
Outputs = self.nes.keyboard.state1_keys;

Population = 300;
DeltaDisjoint = 2.0;
DeltaWeights = 0.4;
DeltaThreshold = 1.0;

StaleSpecies = 15;

MutateConnectionsChance = 0.25;
PerturbChance = 0.90;
CrossoverChance = 0.75;
LinkMutationChance = 2.0;
NodeMutationChance = 0.50;
BiasMutationChance = 0.40;
StepSize = 0.1;
DisableMutationChance = 0.4;
EnableMutationChance = 0.2;

TimeoutConstant = 20;

MaxNodes = 1000000;
