$(document).ready(function() {

$('.video').append('<i class="fa fa-play-circle cover"></i><i class="fa fa-pause cover"></i>');
$('.video').on('click', function() {

   console.log($(this).data('video'));
   if($(this).hasClass('before') && $(this).data('video')) { 
      $(this).append(
               '<video>' +
               '<source src="assets/webm/' + $(this).data('video') + '.webm" type="video/webm" />' +
               '<source src="assets/mp4/' + $(this).data('video') + '.mp4" type="video/mp4" />' +
               '</video>'
            );
   }

   $(this).removeClass('before');

   $(this).toggleClass('playing');

   if(!$(this).hasClass('playing')) {
      $(this).find('video')[0].pause();
      return;
   }


   //$(this).find('.background').css('opacity', 1);

   $(this).find('video')[0].play();

   $(this).find('video')
   .on('ended', function() {
      $(this).parent().trigger('click');
   })
})

});
