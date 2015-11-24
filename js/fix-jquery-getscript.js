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

// Now add a "jQuery getScript" equivalent function with one that will load
// scripts synchronously. Each include will only begin when the previous one
// have finished.
jQuery.extend({
  includeStack: [],
  includeScript: function (url) {
    if (url === false) {
      url = jQuery.includeStack[0];
    } else {
      jQuery.includeStack.push(url);
      //console.log('stacking '+ url +' #stack '+ jQuery.includeStack.length);
    }
    if (jQuery.includeStack.length > 0 && jQuery.includeStack[0] !== true) {
      jQuery.getScript(url, function includeScriptCallback () {
        //console.log('included and executed '+ url +' #stack '+ jQuery.includeStack.length);
        jQuery.includeStack.shift();
        if (jQuery.includeStack.length > 0) {
          jQuery.includeScript( false );
        }
      });
      jQuery.includeStack[0] = true; // soon to be shifted
    }
  },
});
