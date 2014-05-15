$(function() {

$('.comments').on('click', function() {
   $(this).toggleClass('expanded');
});

$('.comments form').on('click', function(e) {
   e.stopPropagation();
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
   //loadComments();
   addComment('New York, USA', Date.now(), 'Looks great guys');
   addComment('Copenhagen, Denmark', Date.now(), 'A');
   addComment('San Luis Obispo, USA', Date.now(), 'This is a really long comment, though maybe we should limit comments to be shorter than 140 characters? Twitter is the magic number, right?');
});

$('.comments form').submit(function(e) {

   e.preventDefault();

   var text = $(this).find('input').val();

   console.log('text');
   addComment('San Luis Obispo, USA', Date.now(), text); 

   return true;

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

//geocoder = new google.maps.Geocoder();
