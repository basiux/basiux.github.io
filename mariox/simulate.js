// usage:
//   simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
var simulate = {
  keyDown: function (key) {
    return self.nes.keyboard.setKey(key, 0x41);
  },

  keyUp: function (key) {
    return self.nes.keyboard.setKey(key, 0x40);
  },

  keyPress: function (key) {
    var result = this.keyDown(key);
    setTimeout( function () {return simulate.keyUp(key)}, 500 );
    return result;
  }
};
