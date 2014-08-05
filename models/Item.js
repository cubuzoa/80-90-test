module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var ItemSchema = new Schema({
        name: String,
        url: String,
    });
    mongoose.model( 'Item', ItemSchema );
}