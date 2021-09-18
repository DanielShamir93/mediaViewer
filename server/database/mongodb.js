const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://21dans2393:and21238@Uploader.mb0dv.mongodb.net/Uploader?retryWrites=true&w=majority";

const Connect = async () => {
    try {
        // mongodb cloud connection
        const con = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch(err) {
        console.log(err.stack);
        process.exit(1);
    }
}

module.exports = Connect;