module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var ItemSchema = new Schema({
        name: String,
        url: String,
    });
    
    ItemSchema.statics.random = function(cb) {
      this.count(function(err, count) {
        if (err) return cb(err);
        var rand = Math.floor(Math.random() * count);
        this.findOne().skip(rand).exec(cb);
      }.bind(this));
    };
    
    return mongoose.model( 'Item', ItemSchema );
}