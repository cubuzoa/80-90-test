module.exports = function( app, mongoose ) {
    
    var User = mongoose.model( "User" );
    var Item = mongoose.model( "Item" );

    app.get('/', function(req, res, next) {
    	res.render("index");
    });
    
    app.post('/item/save', function(req, res, next) {
    	var itemModel = new Item(req.body);
    	itemModel.save(function(err, res) {
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
}