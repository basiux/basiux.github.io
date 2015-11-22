jQuery.getScript("engine.js");

// Initialize Mario on first stage

// rather use some callback later on
setTimeout( function pressStart () {
  engine.keyPress(self.nes.keyboard.state1_keys.KEY_START);
}, 2100);
