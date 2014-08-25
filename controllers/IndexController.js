var utils = require("../lib/utils.js");
module.exports = function( app, mongoose ) {
    
    var Game = mongoose.model( "Game" );
    var Item = mongoose.model( "Item" );

    app.get('/', function(req, res, next) {
    	res.render("index");
    });

    app.get('/game', function(req, res, next) {
        var gameModel = new Game();
        gameModel.start = Date.now();
        gameModel.save(function(err, game) {
            res.render('index', {
                gameId: game._id
            });
        });
    });

    app.get('/result/:gameId', function(req, res, next) {
        Game.findOne({_id: req.params.gameId}, function(err, game) {
            console.log(game.end - game.start);
            res.render('index', {
                result: true,
                game: game,
                duration: (game.end - game.start) / 1000
            })
        })
    });
    
    app.post('/item/save', function(req, res, next) {
    	var itemModel = new Item(req.body);
    	itemModel.save(function(err, item) {
    	    if (err) {
    	        res.json({
    	            type: false,
    	            result: "Error occured: " + err
    	        });
    	    } else {
    	        res.json({
    	            type: true,
    	            result: "Saved successfully"
    	        });
    	    }
    	})
    });
    
    app.get('/item/random/:gameId', function(req, res, next) {
        var gameId = req.params.gameId;
        Game.findOne({_id: gameId}, function(err, game) {
           if (game) {
               Item.random(game.items, function(err, item) {
                   var item = item[0];
                   if (err) {
                       res.json({
                           type: false,
                           result: "Couldn't get item"
                       });
                   } else {
                       game.items.push(item._id);
                       game.save(function(err, uGame) {
                           res.json({
                               type: true,
                               result: item,
                               shuffled: utils.shuffleWord(item.name)
                           });
                       });

                   }
               });
           } else {
               res.json({
                   type: false,
                   result: "Game not found"
               })
           }
        });
    });
    
    app.post('/item/check', function(req, res, next) {
        var id = req.body.id;
        var result = req.body.text;
        var gameId = req.body.gameId;

        Item.findOne({_id: id, name: result}, function(err, item) {
           if (err) {
               res.json({
                   type: false,
                   result: "Couldn't check item"
               }); 
           } else {
               if (!item) {
                    res.json({
                       type: false,
                       result: "Yanlış"
                   });     
               } else {
                   Game.findOne({_id: gameId}, function(err, game) {
                       if ( game.items.length == 10) {
                           game.end = Date.now();
                           game.save(function(err, sGame) {
                              res.json({
                                  type: true,
                                  result: "Doğru",
                                  redirect: true
                              });
                           });
                       } else {
                           res.json({
                               type: true,
                               result: "Doğru",
                               redirect: false
                           });
                       }
                   });
               }  
           }
        });
    });
}