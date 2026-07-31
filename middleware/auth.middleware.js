require("dotenv").config();

const authMiddleware = (req, res, next) => {
    try {
        // Read headers
        const username = req.header("Username");
        const password = req.header("Password");

        // Check if headers are present
        if (!username || !password) {
            return res.status(401).json({
                success: false,
                message: "Authentication headers are required."
            });
        }

        // Validate credentials
        if (
            username !== process.env.API_USERNAME ||
            password !== process.env.API_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = authMiddleware;