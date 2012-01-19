(function($) {
  window.testBase = {
    onReady: function() {
      $('body').append('<h1 class="ready">');
    },
    
    onLoad: function() {
      $('body').append('<h1 class="load">');
    }
  }
}(jQuery));