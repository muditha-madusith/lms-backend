const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']; // Get token from headers

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    // Remove 'Bearer ' from the token string if you provide
    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authMiddleware;
