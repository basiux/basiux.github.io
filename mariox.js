function isEmpty (foo) {
  return (foo == null); // should work for undefined as well
}

// load Mario and controls
$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();
jQuery.includeScript("simulate.js");

// this will need to go away soon, as it should be pressed by the Ai
setTimeout( function pressStart () {
//  simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
}, 2100);

jQuery.includeScript("mariox/configuration.js");

jQuery.includeScript("mariox/toolbox.js");

jQuery.includeScript("mariox/memory.js");

jQuery.includeScript("mariox/functions.js");

jQuery.includeScript("mariox/files.js");

jQuery.includeScript("mariox/main.js");
