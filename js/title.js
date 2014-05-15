$(function() {
   $('#title')
      .css('opacity', '1')
      .css('top', function() {
         return (($(window).height() / 2) - ($(this).height()/2));
      })
      .css('left', function() {
         return (($(window).width() / 2) - ($(this).width()/2));
      });
})
