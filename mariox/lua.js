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
  console.warn('called joypad.set - probably need to press buttons here');
  // simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
}
