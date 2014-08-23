module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var GameSchema = new Schema({
        start: Date,
        end: Date,
        items: [String]
    });
    return mongoose.model( 'Game', GameSchema );
}