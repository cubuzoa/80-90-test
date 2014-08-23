module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var ItemSchema = new Schema({
        name: String,
        url: String
    });
    
    ItemSchema.statics.random = function(excluded, cb) {
      this.count({_id: {$nin: excluded}}, function(err, count) {
        if (err) return cb(err);
        var rand = Math.floor(Math.random() * count);
        this.find({_id: {$nin: excluded}}).skip(rand).limit(1).exec(cb);
      }.bind(this));
    };
    
    return mongoose.model( 'Item', ItemSchema );
}