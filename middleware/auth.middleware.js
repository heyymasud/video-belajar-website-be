const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware to check if the request has a valid authorization header
 * containing a JSON Web Token.
 *
 * If the header is missing or the token is invalid, it will return a 403
 * status code with a message indicating that the user is unauthorized.
 *
 * If the token is valid, it will add the decoded user object to the request
 * object.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to call in the middleware stack
 */
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