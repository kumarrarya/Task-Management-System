const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tcmTM'; // Replace with your actual secret

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting token in the form "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log("decoded: ",decoded);
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};


module.exports = authenticateToken;
