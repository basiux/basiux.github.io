// usage:
//   simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
var simulate = {
  keyDown: function (key) {
    self.nes.keyboard.setKey(key, 0x41);
  },

  keyUp: function (key) {
    self.nes.keyboard.setKey(key, 0x40);
  },

  keyPress: function (key) {
    this.keyDown(key);
    setTimeout( function () {simulate.keyUp(key)}, 500 );
  }
};
