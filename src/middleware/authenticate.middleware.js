import JwtService from "../services/jwt.service.js";

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
             return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];
        const payload = JwtService.verifyAccessToken(token);

        req.user = payload;

        return next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                success: false,
                code: "ACCESS_TOKEN_EXPIRED",
                message: "Access token expired"
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                code: "INVALID_ACCESS_TOKEN",
                message: "Invalid access token"
            });
        }

        next(error);

    }
};

export default authenticate;