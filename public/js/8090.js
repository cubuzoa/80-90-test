var Main = function ($) {

    return {
        init: function () {
            Main.initDraggable();       
            Main.initDroppable();
        },
        initDraggable: function() {
            var a = 3;
            $(".draggable").draggable({ 
                revert: 'invalid',
                start: function(event, ui) { $(this).css("z-index", a++); }
                
            });    
        },
        initDroppable: function() {
            $(".droppable").droppable({
                accept: '.draggable',
                activeClass: 'ui-state-hover',
                hoverClass: 'ui-state-active',
                drop: function(event, ui) {
                    $(this).addClass('ui-state-highlight').html($(ui.draggable).text());
                    $(ui.draggable).remove();
                }
            });
        }

    };

}(jQuery);