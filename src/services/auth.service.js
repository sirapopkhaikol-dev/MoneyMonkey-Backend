import { googleClient } from "../config/google.config.js";

class AuthService {

    static googleLogin = async ( idToken ) => {

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload();

        return {
            success: true,
            message: "Google login successful",
            data: {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
            }
        }

    }
}

export default AuthService;