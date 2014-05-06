$(document).ready(function() {

$('.audio').append('<i class="fa fa-volume-up cover"></i><i class="fa fa-volume-down cover"></i>');
$('.audio').on('click', function() {

   $(this).toggleClass('playing');

   if(!$(this).hasClass('playing')) {
      $(this).find('audio')[0].pause();
      return;
   }

   $(this).find('audio')[0].play();

   $(this).find('audio')
   .on('ended', function() {
      $(this).parent().trigger('click');
   })

});

});
