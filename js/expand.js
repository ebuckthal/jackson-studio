$(function() {

   $('.expand')
   //.append('<i class="fa fa-chevron-circle-left nav"></i>')
   .append('<i class="fa fa-chevron-circle-right nav"></i>');

   $('.expand').append('<i class="fa fa-plus-circle cover"></i>');

   var bLazy = new Blazy({
      selector: '.this'
   })

   $('.expand').on('click', function() {

      $(this).toggleClass('expanded');
   });

   $('.expand .fa-chevron-circle-right').on('click', function(e) {
         e.stopPropagation();

         var next = $(this).parent().find('.this').next('.cycle-image');
         var first = $(this).parent().find('.cycle-image').first();

         console.log($(this).parent());

         console.log(next);
         console.log(first);

         $(this).parent().find('.this').removeClass('this');

         if(next.length == 0) {
            first.addClass('this');

         } else {
            next.addClass('this');
         }

         var bLazy = new Blazy({
            selector: '.this'
         });

      });


});
