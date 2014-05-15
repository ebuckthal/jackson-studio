$(function() {


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

   tile.style.opacity = '1';

   nextLeft += 210;

   if(nextLeft >= $(window).width()) {
      nextLeft = 0;
      nextTop += 210;
   }
}

$('.info').on('click', function() {
   $(this).toggleClass('expanded');
});

});
