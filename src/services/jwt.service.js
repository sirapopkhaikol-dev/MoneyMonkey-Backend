import jwt from "jsonwebtoken";

class JwtService {

    static signAccessToken = (payload) => {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    };

    static signRefreshToken = (payload) => {
        return jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );
    };

    static verifyAccessToken = (token) => {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    };

    static verifyRefreshToken = (token) => {
        return jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );
    };

}

export default JwtService;