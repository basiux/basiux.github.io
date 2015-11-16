$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();

var engine = {
  keyDown: function (key) {
    self.nes.keyboard.setKey(key, 0x41);
    //var e = self.nes.keyboard.keys;
    //self.nes.keyboard.keyDown(e);
  },

  keyUp: function (key) {
    self.nes.keyboard.setKey(key, 0x40);
  },

  keyPress: function (key) {
    this.keyDown(key);
    setTimeout( function () {engine.keyUp(key)}, 500 );
  }
};
