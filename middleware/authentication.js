const jwt = require('jsonwebtoken');
const http_status = require('../utils/http_status');
const User = require('../models/Users_Schema');
const asyncWrapper = require('../middleware/asyncWrapper');

const verifyToken = asyncWrapper(
    async (req, res, next) => {
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];

        if (!authHeader) {
            return res.status(400).json({
                message: "Token is required",
                status_code: 400,
                status_text: http_status.FAIL,
            });
        }
        
        const token = authHeader.split(' ')[1]; 
        
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await User.findOne({ email: decodedToken.email });
            
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    status_code: 404,
                    status_text: http_status.FAIL,
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    message: "User is not active",
                    status_code: 403,
                    status_text: http_status.FAIL,
                });
            }

            if (user.isChangedPassword(decodedToken.iat)) {
                return res.status(401).json({
                    message: "Password has changed. Please log in again.",
                    status_code: 401,
                    status_text: http_status.FAIL,
                });
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: "Invalid token",
                    status_code: 401,
                    status_text: http_status.FAIL,
                });
            }
            return res.status(500).json({
                message: err.message || 'Error verifying token',
                status_code: 500,
                status_text: http_status.FAIL,
            });
        }
    }
);

module.exports = verifyToken;
