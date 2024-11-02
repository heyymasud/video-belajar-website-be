const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const authorization = req.headers["authorization"];

    if (!authorization) {
        return res.status(403).json({
            message: "Unauthorized",
        });
    }

    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(403).json({
            message: "Invalid Token",
        });
    }

    next();
};

module.exports = authMiddleware;