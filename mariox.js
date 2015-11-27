function isEmpty (foo) {
  return (foo == null); // should work for undefined as well
}

jQuery.includeScript("mariox/lua.js");

jQuery.includeScript("mariox/lz-string.min.js"); // compressing json for localstorage

// load Mario and controls
$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();
jQuery.includeScript("simulate.js");

jQuery.includeScript("mariox/configuration.js");

jQuery.includeScript("mariox/toolbox.js");

jQuery.includeScript("mariox/memory.js");

jQuery.includeScript("mariox/functions.js");

jQuery.includeScript("mariox/files.js");

jQuery.includeScript("mariox/showai.js");

jQuery.includeScript("mariox/main.js");
