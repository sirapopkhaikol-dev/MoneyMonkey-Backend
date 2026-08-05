import AuthService from "../services/auth.service.js";

class AuthController {
    static googleLogin = async (req, res) => {
        // Implementation for Google login
        const body = req.body;
        const result = await AuthService.googleLogin(body.idToken);
        return res.status(200).json(result);
    }
}

export default AuthController;