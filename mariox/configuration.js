// this should probably go on the toolbox, but while we got no sections there...

//-- For SMW, make sure you have a save state named "DP1.state" at the beginning of a level,
//-- and put a copy in both the Lua folder and the root directory of BizHawk.
Filename = "mariox.state"

// based mostly on self.nes.keyboard.state1_keys
ButtonNames = [
  'A',
  'B',
  'RIGHT',
  'LEFT',
//  'DOWN',
  'UP', // last command is being ignored, right now! :(
];

BoxRadius = 6;
InputSize = (BoxRadius*2+1)*(BoxRadius*2+1);

Inputs = InputSize+1;
Outputs = ButtonNames.length;

Population = 300; // species
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

FitnessMinFilter = 1000;
FitnessMaximumRateFilterNewOne = 2;
