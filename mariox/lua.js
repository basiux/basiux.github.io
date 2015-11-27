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

function loadState (stateName) { // review
  // there is no state saving for now. we will need to build something
  // at least to get out from menu screen, by pressing start at it.
  // for now, it can be called just once, or else there's a risk of pause
  // AND...
  // it ended up being easier to just let Mario press START after all! :D :)
  // this is not even being used anymore (for now anyway).
  setTimeout(function () {
//    simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
  }, 2100)
}
