
$(document).ready(function(e){
  $.getScript("/visualize/audio.js", function(e){
    $('body').append($('<script>').attr('src',this.url));
  });
  $.getScript("/visualize/orbitControls.js", function(e){
    $('body').append($('<script>').attr('src',this.url));
  });
  $.getScript("/visualize/visualizerOne.js", function(e){
    $('body').append($('<script>').attr('src',this.url));
  });
});