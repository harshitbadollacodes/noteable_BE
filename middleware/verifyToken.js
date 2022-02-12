const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config;

const verifyToken = (req, res, next) => {
    try {
        const secret = process.env.JWT_SECRET;

        const token = req.headers.authorization.split(" ")[1];
        console.log("token", token);
        const decoded = jwt.verify(token, secret);
        
        req.userId = decoded.userId;
        next();

    } catch(error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Auth failed"
        });
    }
}

module.exports = verifyToken;