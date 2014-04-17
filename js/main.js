var tiles = $(".tile")

$('.tile').append('<i class="fa fa-plus-square invisible expand"></i><i class="fa fa-minus-square invisible contract"></i>');

$(".tile").draggable();

$(".tile").on('mouseenter', function() {

   if($(".ui-draggable-dragging").length > 0) {
      return;
   }

   $('.tile').removeClass("active").find('.expand').addClass('invisible');
   $(this).addClass('active');

   $(this).find('.expand').removeClass("invisible");

   this.style.zIndex = tiles.length;


   $.each(tiles, function(k,v) {
      v.style.zIndex--;
   });

})

$('.tile .expand').on('click', function() {
   $(this).parent().addClass('expanded');
   $(this).parent().find('.expand').addClass('invisible');
   $(this).parent().find('.contract').removeClass('invisible');
});

$('.tile .contract').on('click', function() {
   $(this).parent().removeClass('expanded');
   $(this).parent().find('.expand').removeClass('invisible');
   $(this).parent().find('.contract').addClass('invisible');
});

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
