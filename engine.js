$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();

// usage:
//   engine.keyPress(self.nes.keyboard.state1_keys.KEY_START);
var engine = {
  keyDown: function (key) {
    self.nes.keyboard.setKey(key, 0x41);
  },

  keyUp: function (key) {
    self.nes.keyboard.setKey(key, 0x40);
  },

  keyPress: function (key) {
    this.keyDown(key);
    setTimeout( function () {engine.keyUp(key)}, 500 );
  }
};
