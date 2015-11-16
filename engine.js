function simulateKeyPress(character) {
  jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
}

$('.nes-roms select').val('jsnes/Super Mario Bros. (Japan, USA).nes').change();

$('body').keypress(function(e) {
  $('canvas.nes-screen').trigger({
    type: 'keypress',
    which: String.prototype.charCodeAt(e)
  });
});

$(function() {

  simulateKeyPress("\n");
});
