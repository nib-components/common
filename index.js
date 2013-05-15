var Accordion         = require('accordion');
var Tip               = require('tip');
var Affix             = require('affix');
var ScrollSpy         = require('scroll-spy');
var Waypoints         = require('waypoints');
var Dialog            = require('dialog');
var breakpoints       = require('breakpoints');
var Attributes        = require('body-attributes');
var OffCanvas         = require('off-canvas');
var slideshow         = require('banner-slideshow');
var ga                = require('analytics');

var body = $('body');
var root = $('html');

var mediaQuery = function(query) {
  return window.matchMedia && window.matchMedia(query).matches;
};

/**
 * Allows enabling of debugging mode
 */

window.debug = require('debug');

/**
 * For styling depending on whether JS is enabled
 */

root.removeClass('no-js').addClass('js');

/**
 * Retina classes for using high-resolution images
 * This is targetting using a mixin in Sass
 */

if( mediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)') ) {
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

/**
* Fire google analytics events on click
*/
body.on('click', '[data-track-event]', function(el){
  ga.trackEvent({
    category: this.getAttribute('data-category'),
    action: this.getAttribute('data-action') || 'Click',
    label: this.getAttribute('data-label'),
    value: this.getAttribute('data-value')
  });
});

/**
 * Create off-canvas menu
 */
var menu = document.querySelector('.js-mobile-menu');
if(menu) {
  OffCanvas.create({ el: menu });
}

/**
 * Create tooltips
 */
Tip.create({
  context: body
});

/**
 * Accordions
 */
Accordion.create('.js-accordion', {
  afterEach: function(accordion){
    accordion.on('toggle', function(){
      ga.trackEvent({
        category: accordion.el.attr('data-category') || 'Accordion',
        action: 'Toggle',
        label: accordion.el.attr('data-label')
      });
    });
  }
});

/**
 * Book a callback dialog
 */
require('callback-dialog')();

/**
 * Set data attribute on the body for the current breakpoint
 */
Attributes.create(breakpoints.events, {
  'attr': 'data-breakpoint'
});

/**
 * Sticky menus
 */

Affix.create('[data-affix]');

/**
 * Scroll Spy
 */

ScrollSpy.create('[data-scroll-spy]', {
  offsetAttribute: mediaQuery('(min-width: 640px)') ? 'data-offset' : null
});

/**
 * Create waypoints using .js-waypoint classes
 */

var waypoints = Waypoints.create({
  addClass: 'is-scrolled',
  removeClass: 'is-paused',
  offset: 50
});

waypoints.on('point', function(point){
  ga.trackEvent({
    category: 'Animation',
    action: 'Scroll',
    value: Math.round(point)
  });
});

if( mediaQuery('(max-width: 640px)') ) {
  waypoints.each(function(point){
    waypoints.fire(point).remove(point);
  });
}

/**
 * Create banner slideshows
 */
$('.js-slideshow').each(function(){
  slideshow({ el: this });
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
 * Smooth scrolling for local links
 */
body.on('click', '.js-local-scroll', function(event){
  event.preventDefault();
  var target = $(this.getAttribute('href'));
  var offset = this.getAttribute('data-offset') * 1 || 0;
  $('html, body').stop().animate({ scrollTop: target.offset().top - body.offset().top + offset }, { duration: 2000, easing: 'easeOutExpo'});
});