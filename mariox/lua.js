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

function joypadSet (controller) {
  // simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
  for (var button in controller) {
    if (controller[button]) {
      //console.log(button +' down');
      simulate.keyDown(self.nes.keyboard.state1_keys[button]);
    } else {
      //console.log(button +' up');
      simulate.keyUp(self.nes.keyboard.state1_keys[button]);
    }
  }
  //console.log('joypad.set: '+ JSON.stringify(controller));
}
