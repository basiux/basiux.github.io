// adapted functions to work like lua script

function mathRandom (min, max) {
  if ( isEmpty(min) ) {
    return Math.random();
  }
  if ( isEmpty(max) ) {
    max = min;
    min = 1;
  }
  return Math.floor(Math.random() * (max - min)) + min;
}

function joypadSet (controller) { // review
  // no idea what this should do yet!
  console.log('called joypad.set')
}