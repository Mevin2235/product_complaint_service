const authMiddleware = (req, res, next) => {

    const apiKey = req.header("x-api-key");

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "x-api-key header is required."
        });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            success: false,
            message: "Invalid API Key."
        });
    }

    next();
};

module.exports = authMiddleware;