$(document).ready(function() {


   $('#title')
   .css('top', function() {
      return ($(window).height() / 2) - ($(this).height()/2);
   })
   .css('left', function() {
      return ($(window).width() / 2) - ($(this).width()/2);
   });

$('.draggable')
.draggable()
.on('mouseenter', function() {
   if($(".ui-draggable-dragging").length > 0) {
      return;
   }

   $('.tile').removeClass("active");
   $(this).addClass('active').css('z-index', $('.tile').size());


   $('.tile').each(function(k,v) {
      $(this).css('z-index', function() { return $(this).css('z-index')-1; });
   });

});

var tiles = $(".tile")

$('.tile').each(function(index) {
   $(this).css('z-index', index);
});

for(var i = 0, tile, nextTop = 0, nextLeft = 0; tile = tiles[i++]; ) {

   tile.style.top = nextTop + 'px';
   tile.style.left = nextLeft + 'px';

   nextLeft += 210;

   if(nextLeft >= $(window).width()) {
      nextLeft = 0;
      nextTop += 210;
   }
}


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

$('.cycle-image')
.append('<i class="fa fa-chevron-circle-left"></i>')
.append('<i class="fa fa-chevron-circle-right"></i>');

$('.expand').append('<i class="fa fa-plus-circle cover"></i>');
$('.expand').on('click', function() {

   var parent = $(this);

   $(this).toggleClass('expanded');

   $(this).find('.fa-chevron-circle-right').on('click', function(e) {
      e.stopPropagation();

      var next = parent.find('.this').next('.cycle-image');
      var first = parent.find('.cycle-image').first();

      parent.find('.this').removeClass('this');

      if(next.length == 0) {
         first.addClass('this');

      } else {
         next.addClass('this');
      }
   });
});

$('.video').append('<i class="fa fa-play-circle cover"></i><i class="fa fa-pause cover"></i>');
$('.video').on('click', function() {

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

$('.info').on('click', function() {
   $(this).toggleClass('expanded');
});

$('.comments').on('click', function() {
   $(this).toggleClass('expanded');
});

function addComment(loc, time, text) {
   var date = new Date(parseInt(time));

   var comment = '<div class="comment">' 
      + '<p>' + text + '</p>'
      + '<p>' + loc + '</p>'
      + '<p data-date="' + time + '">' 
         + date.getHours() + ' ' 
         + date.getMinutes() + ' ' 
         + date.getSeconds() + '</p>'
      + '</div>'; 

   $('.other-comments').prepend(comment);

   $('.other-comments .comment').sort(function(a,b) {
      console.log(a,b);
      return a.dataset.date > b.dataset.date;
   })
}

function loadComments() {

   $.ajax({
      type: 'GET',
      url: 'http://thesis.ebuckthal.com:8888/comments',
      crossDomain: true,
      dataType: 'json',
      context: $('.other-comments')[0],
   })
   .success(function(d) {
      d.forEach(function(value, index) {
         addComment(value.loc, value.time, value.text);
      }, this);
   })
   .error(function(m) {
      addComment(null,null,null,"Could not fetch comments");
   });

}

$('.other-comments').ready(function(e) {
   $(this).empty();
   loadComments();
});

$('.comments form').submit(function(e) {

   e.preventDefault();

   var text = $(this).find('input').val();


   if (!navigator.geolocation){
      alert('sorry, geolocation is not supported by your browser');
      return;
   }

   navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var time = Date.now();



      var latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
      geocoder.geocode({'latLng': latlng}, function(results, status) {

         if (status != google.maps.GeocoderStatus.OK) {
            return "something went wrong";
         }

         if (!results[1]) {
            return "location not specified";
         }

         var city = results[1]['address_components'][1].short_name;
         var state = results[1]['address_components'][3].short_name;
         var country = results[1]['address_components'][4].short_name;

         var loc = city + ', ' + state + ', ' + country;

         var toSend = { loc: loc, time: time, text: text };
         addComment(loc, time, text);
         
         $.ajax({
            type: 'POST',
            url: 'http://thesis.ebuckthal.com:8888/comments',
            crossDomain: true,
            dataType: 'json',
            data: toSend,
         })
         .error(function(m) {
            console.log(m);
         });

      }, 
      function() {
         alert('there was an error with geolocation');
      });


   })
});

});



geocoder = new google.maps.Geocoder();







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
