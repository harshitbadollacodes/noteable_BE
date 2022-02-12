const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const initializeDBConnection = () => {
    try {
        const dbURI = process.env.DB_URI;

        const mongooseConnection = mongoose.connect(dbURI, {
            useNewURLParser: true,
            useUnifiedTopology: true
        });

        if (mongooseConnection) {
            console.log('mongoose connected');
        };

    } catch(error) {
        console.log(error);
    }
};

module.exports = initializeDBConnection;