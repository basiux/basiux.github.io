// Replace the normal jQuery getScript function with one that supports
// debugging and which references the script files as external resources
// rather than inline.
jQuery.extend({
   getScript: function(url, callback) {
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.src = url;

      // Handle Script loading
      {
         var done = false;

         // Attach handlers for all browsers
         script.onload = script.onreadystatechange = function(){
            if ( !done && (!this.readyState ||
                  this.readyState == "loaded" || this.readyState == "complete") ) {
               done = true;
               if (callback)
                  callback();

               // Handle memory leak in IE
               script.onload = script.onreadystatechange = null;
            }
         };
      }

      head.appendChild(script);

      // We handle everything using the script element injection
      return undefined;
   },
});

// load Mario and controls
$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();
jQuery.getScript("simulate.js");

// this will need to go away soon, as it should be pressed by the Ai
setTimeout( function pressStart () {
  simulate.keyPress(self.nes.keyboard.state1_keys.KEY_START);
}, 2100);

jQuery.getScript("mariox/configuration.js");

jQuery.getScript("mariox/toolbox.js");

jQuery.getScript("mariox/memory.js");

//jQuery.getScript("mariox/functions.js");

jQuery.getScript("mariox/files.js");

jQuery.getScript("mariox/main.js");
