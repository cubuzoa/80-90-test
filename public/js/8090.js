var Main = function ($) {
    
    return {
        init: function () {
            Main.refreshItem();
        },
        initSourceClick: function() {
            $(".src").on("click", function() {
                $.playSound("/sound/move");
                $(".letters-result").removeClass("answer-wrong").removeClass("answer-true");
                var letter = $(this).text();
                var firstLetter = $(".letter-not-added").first();
                firstLetter.text(letter).attr("data-src", $(this).data("id")).addClass("letter-added").removeClass("letter-not-added");
                $(this).text("");
                $("#resultText").val("" + $("#resultText").val() + letter);
                Main.checkResult();
            });    
        },
        initDestClick: function() {
            $(".dest").on("click", function() {
                $.playSound("/sound/move");
                if ($(this).attr("data-src").length > 0) {
                    $('[data-id="' + $(this).attr("data-src") + '"]').text($(this).text());
                    $(this).attr("data-src", "");
                    $(this).text("-");
                    $(this).removeClass("letter-added").addClass("letter-not-added")
                    if ($("letter-added").length < 1) {
                        $(".dest").removeClass("answer-true").removeClass("answer-wrong");
                    }
                }
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
                $(".letters-result .dest").removeClass("answer-wrong").removeClass("answer-true");
            });
        },
        initRefresh: function() {
            $(".letters-result").removeClass("answer-wrong").removeClass("answer-true");
            Main.refreshItem();
        },
        checkResult: function() {
            if ($(".letter-not-added").size() > 0) {
                return false;
            }  
            $("#revert-btn").prop("disabled", true);
            var itemId = $("#itemId").val();
            var gameId = $("#gameId").val();
            var result = "";
            $(".letter-added").each(function() {
                result += "" + $(this).text() + "";
            }).promise().done(function() {
                $.ajax({
                    url: "/item/check",
                    type: "POST",
                    data: {id: itemId, text: result, gameId: gameId},
                    success: function(response) {
                        if (response.type) {
                            $(".letters-result .dest").removeClass("answer-wrong").addClass("answer-true");
                            if (response.redirect) {
                                window.location = "/result/" + gameId;
                            } else {
                                $.playSound("/sound/success");
                                Main.initRefresh();
                            }
                        } else {
                            $.playSound("/sound/error");
                            $(".letters-result .dest").removeClass("answer-true").addClass("answer-wrong");
                        }
                    }
                });
            });
        },
        refreshItem: function() {
            $("#resultText").val("");
            $.ajax({
               url: "/item/random/" + $("#gameId").val(),
               type: "GET",
               success: function(response) {
                   $("#availableWords").empty();
                   $("#resultWords").empty();
                   $("#itemImg").attr("src", response.result.url);
                   $("#itemId").val(response.result._id);
                   $("#itemImg").bind('load', function() {
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
                       Main.initDestClick()
                       Main.initRevertLetters();
                       $("#refresh-btn").prop("disabled", true);
                   });
               }
            });
        }

    };

}(jQuery);