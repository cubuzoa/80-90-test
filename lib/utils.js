var utils = {
    connectToDatabase:function (mongoose, cb) {
        return mongoose.connect(process.env.MONGO_URL, cb);
    },
    shuffleWord: function(word, cb) {
        var text = "";
        var possible = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
    
        for( var i = 0; i < 3; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        var finalWord = word + "" + text;
        
        var a = finalWord.split(""),
        n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }
};
module.exports = utils;