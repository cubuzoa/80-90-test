var Main = function ($) {

    return {
        init: function () {
            Main.refreshItem();
            Main.initRefreshButton();
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
        },
        initRefreshButton: function() {
            $("#refresh-btn").on("click", function() {
                Main.refreshItem();    
            });  
        },
        refreshItem: function() {
            $.ajax({
               url: "/item/random",
               type: "GET",
               success: function(response) {
                   $("#availableWords").empty();
                   $("#resultWords").empty();
                   $("#itemImg").attr("src", response.result.url);
                   // available letters
                   var html = '';
                   var shuffleArr = response.shuffled.split("");
                   for (var i = 0; i < shuffleArr.length; i++) {
                       html += '<span class="label label-primary f draggable">' + shuffleArr[i] + '</span>';
                   }
                   $("#availableWords").html(html);
                   
                   // result letters
                   var wordLength = response.result.name.length;
                   $("#resultWords").html(Array(wordLength + 1).join('<div class="droppable fr">-</div>'));
                   Main.initDraggable();       
                   Main.initDroppable();
               }
            });
        }

    };

}(jQuery);