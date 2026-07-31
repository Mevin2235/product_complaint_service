require("dotenv").config();

const authMiddleware = (req, res, next) => {
    try {
        const apiKey = req.header("x-api-key");

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "API Key is required."
            });
        }

        if (apiKey !== process.env.API_KEY) {
            return res.status(401).json({
                success: false,
                message: "Invalid API Key."
            });
        }

        next();

    } catch (error) {
        console.error("Authentication Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = authMiddleware;