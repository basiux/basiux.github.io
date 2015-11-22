// load Mario and controls
$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();
jQuery.getScript("simulate.js");

// this will need to go away soon, as it should be pressed by the Ai
setTimeout( function pressStart () {
  simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
}, 2100);

jQuery.getScript("mariox/configuration.js");

jQuery.getScript("mariox/toolbox.js");

jQuery.getScript("mariox/functions.js");

jQuery.getScript("mariox/main.js");
