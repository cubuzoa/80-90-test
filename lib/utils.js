var utils = {
    connectToDatabase:function (mongoose, cb) {
        return mongoose.connect(process.env.MONGO_URL, cb);
    }
};
module.exports = utils;