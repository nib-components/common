var Accordion       = require('accordion');
var Tip             = require('tip');
var Affix           = require('affix');
var ScrollSpy       = require('scroll-spy');
var callback        = require('callback-dialog');
var Waypoints       = require('waypoints');
var Dialog          = require('dialog');
var FormValidator   = require('form-validator');

module.exports = function(){

  var body = $('body');

  /**
   * For styling depending on whether JS is enabled
   */
  
  $('html').removeClass('no-js').addClass('js');

  /**
   * Retina classes for using high-resolution images
   * This is targetting using a mixin in Sass
   */
  
  if( window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)').matches) {
    $('html').addClass('retina');
  }
  else {
    $('html').addClass('no-retina');
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

  /**
   * Form validation
   * @TODO Add validation for mobile
   */

  if( $('html').hasClass('mobile') === false ) {
    FormValidator.create({
      selector: '.js-validate-form'
    });    
  }

  /**
   * Book a callback dialog
   */
  
  body.on('click', '.js-book-callback', function(event){
    event.preventDefault();
    event.stopPropagation();
    callback(event.currentTarget.getAttribute('href'));
  });

  /**
   * Dialogs
   */
  
  body.on('click', '[data-dialog-url]', function(event){
    event.preventDefault();
    var url = this.getAttribute('data-dialog-url');
    var width = this.getAttribute('data-dialog-width') || false;
    var modal = new Dialog({
      url: url,
      width: width
    });
    modal.show();
  });

  /**
   * Accordions
   */

  Accordion.create('.js-accordion');

  /**
   * Toggle classes on and element by click
   */
  
  body.on('click', '.js-toggle-class', function(event){
    var $this = $(this);
    var target = $this.attr('data-target');
    var targetClass = $this.attr('data-target-class');
    var selfClass = $this.attr('data-self-class');
    var type = $this.attr('data-action');
    if( type === 'add' ) {
      $(target).addClass(targetClass);
    }
    else if( type === 'remove' ) {
      $(target).removeClass(targetClass);
    }
    else {
      $(target).toggleClass(targetClass);
      $this.toggleClass(selfClass);
    }
    if( $this.attr('href') ) {
      event.preventDefault();
    }
  });

  /**
   * Smooth scrolling for local links
   */

  body.on('click', '.js-local-scroll', function(event){
    event.preventDefault();
    var target = $(this.getAttribute('href'));
    var offset = this.getAttribute('data-offset') * 1 || 0;
    $('html, body').stop().animate({ scrollTop: target.offset().top - body.offset().top + offset }, { duration: 2000, easing: 'easeOutExpo'});
  });

  /**
   * Sticky menus
   */
  
  Affix.create('[data-affix]');

  /**
   * Scroll Spy
   */
  
  ScrollSpy.create('[data-scroll-spy]');

  /**
   * Create tooltips
   */
  
  Tip.create({ context: body });

  /**
   * Create waypoints using .js-waypoint classes
   */
  
  Waypoints.create({
    addClass: 'is-scrolled',
    removeClass: 'is-paused',
    offset: 50
  });

};