module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var UserSchema = new Schema({
        name: String,
        competitions: [Schema.Types.Mixed]
    });
    return mongoose.model( 'User', UserSchema );
}