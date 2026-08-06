import AuthService from "../services/auth.service.js";

class AuthController {
    static googleLogin = async (req, res) => {
        // Implementation for Google login
        const { idToken } = req.body;
        const result = await AuthService.googleLogin(idToken);

        
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: result.success,
            message: result.message,
            data: result.data
        });
    }

    static refresh = async (req,res) => {
        const refreshToken = req.cookies.refreshToken;
        const result = await AuthService.refresh(refreshToken);

        return res.status(200).json(result)
    }
}

export default AuthController;