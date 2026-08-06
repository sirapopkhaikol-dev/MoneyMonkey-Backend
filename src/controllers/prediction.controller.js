import PredictionService from "../services/prediction.service.js"

class PredictionController {
    static createPrediction = async (req, res) => {

        const { n_years, initial_amount } = req.body;
        const { id, email, role, iat, exp } = req.user

        const result = await PredictionService.createPrediction(id ,initial_amount, n_years);

        return res.status(200).json(result);
    }

}

export default PredictionController;