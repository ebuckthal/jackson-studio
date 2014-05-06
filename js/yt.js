$(document).ready(function() {

$('.yt').append('<i class="fa fa-play-circle"></i>');

$('.yt').on('click', function() {
   var ytID = $(this).data('yt');

   $(this).toggleClass('large');
   $(this).find('.ytplayer').remove();

   if(!$(this).hasClass('large')) {

      $(this).find('.crop').append('<div class="ytplayer" style="display: none;" id="player-' 
         + ytID 
         + '"></div><div class="overlay"></div>');

      player = new YT.Player('player-' + ytID, {
         width: '356',
             height: '200',
             style: 'position: relative; left -64px;',
             videoId: ytID,
             playerVars: {
                autoplay: 1,
             autohide: 1,
             modestbranding: 1 ,
             controls: 0
             },
      });
      player.addEventListener('onStateChange', 'onytplayerStateChange');

   } else {


      $(this).find('.crop').append('<div class="ytplayer" style="display: none;" id="player-' 
            + ytID 
            + '"></div><div class="overlay"></div>');

      player = new YT.Player('player-' + ytID, {
         width: '712',
         height: '400',
         style: 'position: relative; left -140px;',
         videoId: ytID,
         playerVars: {
            autoplay: 1,
            autohide: 1,
            modestbranding: 1 ,
            controls: 0
         },
      });

      player.addEventListener('onStateChange', 'onytplayerStateChange');
   }

});

});

//YOUTUBE STUFF
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
   $('.yt').addClass('large').trigger('click');
}

function onytplayerStateChange(state) {

   if(state.data == 1) {
      $('#'+state.target.a.id).css('display', 'block');
      if(!$('#'+state.target.a.id).parent().parent().hasClass('large')) {
         player.mute();
      }
   }

   if(state.data == 0) {
      $('#'+state.target.a.id).parent().find('.overlay').remove();
      $('#'+state.target.a.id).remove();
   }
}
