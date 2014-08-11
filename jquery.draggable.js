/*--------------------------------------------------------------
Draggable
alternative to jQuery UI’s draggable
based on comments from: http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
--------------------------------------------------------------*/

(function($) {
  $.fn.draggable = function(options) {

    var method = String(options);
    options = $.extend({handle:"",cursor:"move", scale: 1 }, options);

    return this.each(function() {
      if( /^enable|on|undefined$/.test(method) || typeof(options) === 'object' ) {
        return attachDragging( $(this) );
      }
      else if( /^disable|destroy|off$/.test(method) ) {
        return resetDragging( $(this) );
      }
      else
        return;
    });

    function attachDragging( $el ){
      var $dragged = $dragger = $el;
      if( typeof(options.handle) === "string" ) {
        $dragger = $el.find(options.handle);
      }

      return resetDragging( $dragger ).css('cursor', options.cursor)
        .on('mousedown.draggable touchstart.draggable', function(e) {

          var x = $dragged.offset().left - e.pageX,
            y = $dragged.offset().top - e.pageY,
            z = $dragged.css('z-index');

          if (!$.fn.draggable.stack) {
            $.fn.draggable.stack = 1000;
          }
          stack = $.fn.draggable.stack;

          $(window)
            .on('mousemove.draggable touchmove.draggable', function(e) {
              if( !($dragger.is(e.target) || $dragger.has(e.target)) ){
                return;
              }

              $dragged
                .css({'z-index': stack, 'transform': 'scale('+options.scale+')', 'bottom': 'auto', 'right': 'auto'})
                .offset({
                  left: x + e.pageX,
                  top: y + e.pageY
                })
                .find('a').one('click.draggable', function(e) {
                  e.preventDefault();
                });

              e.preventDefault();
            })
            .one('mouseup.draggable touchend.draggable touchcancel.draggable', function() {
              $(this).off('mousemove.draggable touchmove.draggable click.draggable');
              $dragged.css({'z-index': stack, 'transform': 'scale(1)'})
              $.fn.draggable.stack++;
            });

          e.preventDefault();
        });
    }

    function resetDragging( $el ){
      $(window).off('.draggable');
      return $el.off('.draggable').css('cursor', 'default');
    }

  }
})(jQuery);
