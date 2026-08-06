import { googleClient } from "../config/google.config.js";

import AuthRepository from "../repositories/auth.repository.js";
import JwtService from "./jwt.service.js";

class AuthService {

    static googleLogin = async ( idToken ) => {

        // 1. Verify Google Token
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        // 2. Extract Payload
        const payload = ticket.getPayload();
        const userInfo = {
            google_id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        }

        // 3. Find User
        let user = await AuthRepository.findByGoogleId(payload.sub);

        // 4. Create User if needed
        if (!user) {
            user = await AuthRepository.createUser(userInfo);
        }

        // 5. Generate JWT
        const accessToken = JwtService.signAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        })

        // 6. Generate Refresh Token
        const refreshToken = JwtService.signRefreshToken({
            id :user.id
        })

        // 7. Return Login Result
        return {
            success: true,
            message: "Google login successful",
            data: {
                user,
                accessToken,
            },
            refreshToken
        }

    }

    static refresh = async (refreshToken) => {

        const payload = JwtService.verifyRefreshToken(refreshToken);

        const user = await AuthRepository.findById(payload.id);

        if (!user) { throw new Error("User not found"); }

        const accessToken = JwtService.signAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return {
            success: true,
            message: "Access token refreshed",
            data : { accessToken }
        };
        
    }
}

export default AuthService;