module.exports = function(){

  var body = $('body');
  var root = $('html');

  /**
   * For styling depending on whether JS is enabled
   */
  
  root.removeClass('no-js').addClass('js');

  /**
   * Retina classes for using high-resolution images
   * This is targetting using a mixin in Sass
   */
  
  if( window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)').matches) {
    root.addClass('retina');
  }
  else {
    root.addClass('no-retina');
  }

  // For IE8, this will let us translate something back 50% left/up
  // This is used to horizontally or vertically center things. When 
  // IE8 is dead we can remove this
  if(Modernizr.csstransforms === false) {
    body.find('.js-translate-left').each(function(){
      var el = $(this);
      el.css('margin-left', el.outerWidth() * -0.5);
    }); 
    body.find('.js-translate-up').each(function(){
      var el = $(this);
      el.css('margin-top', el.height() * -0.5);
    });    
  }

};