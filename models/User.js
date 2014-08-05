module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var UserSchema = new Schema({
        name: String,
        competitions: [Schema.Types.Mixed]
    });
    mongoose.model( 'User', UserSchema );
}