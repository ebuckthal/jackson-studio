var GEOlocation = undefined;

$(function() {

$('.comments').on('click', function() {
   $(this).toggleClass('expanded');
});

$('.comments form').on('click', function(e) {
   e.stopPropagation();
});


function addComment(loc, time, text) {

   var m = moment(new Date(parseInt(time)));

   var comment = '<div class="comment">' 
      + '<p class="text">' + text + '</p>'
      + '<p class="loc">' + loc + '</p>'
      + '<p class="time" data-date="' + time + '">' 
         + m.format('MMMM Do h:mm a') + '</p>'
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

   if(typeof GEOlocation == undefined) {
      alert('unable to determine location');
      return;
   }

   var text = $(this).find('input').val();
   var time = Date.now();
   var toSend = { loc: GEOlocation, time: time, text: text };

   addComment(GEOlocation, time, text);
   $('.comments form .text').val('')
   
   $.ajax({
      type: 'POST',
      url: 'http://thesis.ebuckthal.com:8888/comments',
      crossDomain: true,
      dataType: 'json',
      data: toSend,
   })
   .fail(function(m) {
      console.log(m);
   });


   })
});

geocoder = new google.maps.Geocoder();

$(function() {

   if (!navigator.geolocation){
      alert('sorry, geolocation is not supported by your browser');
      return;
   }

   navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;


      var latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
      geocoder.geocode({'latLng': latlng}, function(results, status) {

         if (status != google.maps.GeocoderStatus.OK) {
            return;
         }

         if (!results[1]) {
            return;
         }

         var city = results[1]['address_components'][1].short_name;
         var state = results[1]['address_components'][3].short_name;
         var country = results[1]['address_components'][4].short_name;

         GEOlocation = city + ', ' + state + ', ' + country;

      });
   });

});
