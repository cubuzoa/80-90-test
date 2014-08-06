var Main = function ($) {
    
    return {
        init: function () {
            Main.refreshItem();
            Main.initRefreshButton();
        },
        initSourceClick: function() {
            $(".src").on("click", function() {
                $(".letters-result").removeClass("answer-wrong").removeClass("answer-true");
                var letter = $(this).text();
                var lastSetLetter = $(".letter-added").last();
                if (lastSetLetter.length > 0) {
                    lastSetLetter.next().text(letter).attr("data-src", $(this).data("id")).addClass("letter-added").removeClass("letter-not-added");
                } else {
                    $(".dest").first().text(letter).attr("data-src", $(this).data("id")).addClass("letter-added").removeClass("letter-not-added");
                }
                $(this).text("");
                $("#resultText").val("" + $("#resultText").val() + letter);
                $("#revert-btn").prop("disabled", false);
                Main.checkResult();
            });    
        },
        initRevertLetters: function() {
            $("#revert-btn").on("click", function() {
                $(".letters-result").removeClass("answer-wrong").removeClass("answer-true");
                $(".letter-added").each(function(index) {
                    $('[data-id="' + $(this).attr("data-src") + '"]').text($(this).text());
                    $(this).removeAttr("data-src");
                    $(this).text("-");
                    $(this).removeClass("letter-added").addClass("letter-not-added");
                });
                $("#resultText").val("");
                $("#revert-btn").prop("disabled", true); 
            });
        },
        initRefreshButton: function() {
            $("#refresh-btn").on("click", function() {
                $(".letters-result").removeClass("answer-wrong").removeClass("answer-true");
                Main.refreshItem();    
            });  
        },
        checkResult: function() {
            if ($(".letter-not-added").size() > 0) {
                return false;
            }  
            $("#revert-btn").prop("disabled", true);
            var itemId = $("#itemId").val();
            var result = $("#resultText").val();
            $.ajax({
               url: "/item/check",
               type: "POST",
               data: {id: itemId, text: result},
               success: function(response) {
                    if (response.type) {
                        $(".letters-result").removeClass("answer-wrong").addClass("answer-true");
                        $("#refresh-btn").prop("disabled", false); 
                    } else {
                        $(".letters-result").removeClass("answer-true").addClass("answer-wrong");
                        $("#revert-btn").prop("disabled", false);     
                    }
               }
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
                   $("#itemId").val(response.result._id);
                   // available letters
                   var html = '';
                   var shuffleArr = response.shuffled.split("");
                   for (var i = 0; i < shuffleArr.length; i++) {
                       html += '<div class="src letter-box" data-id="src-' + i + '">' + shuffleArr[i] + '</div>';
                   }
                   $("#availableWords").html(html);
                   
                   // result letters
                   var wordLength = response.result.name.length;
                   var destHtml = '';
                   for (var j = 0; j < wordLength; j++) {
                       destHtml += '<div class="dest letter-box letter-not-added" data-id="dest-' + j + '" data-src="">-</div>';
                   }
                   $("#resultWords").html(destHtml);
                   Main.initSourceClick();
                   Main.initRevertLetters();
               }
            });
        }

    };

}(jQuery);