var tiles = $(".tile")

$(".tile").draggable();

$(".tile").on('mouseenter', function() {

   if($(".ui-draggable-dragging").length > 0) {
      return;
   }

   this.style.zIndex = tiles.length;

   $.each(tiles, function(k,v) {
      v.style.zIndex--;
   });

})

for(var i = 0, tile, nextTop = 0, nextLeft = 0; tile = tiles[i++]; ) {

   tile.style.top = nextTop + 'px';
   tile.style.left = nextLeft + 'px';
   tile.style.zIndex = i;

   nextLeft += 210;

   if(nextLeft >= $(window).width()) {
      nextLeft = 0;
      nextTop += 210;
   }

   tile.style.backgroundColor = 'rgb(' + i*20 + ',0,0)';
}
