import PredictionService from "../services/prediction.service.js"

class PredictionController {
    static createPrediction = async (req, res) => {

        const { n_years, initial_amount } = req.body;
        const { id, email, role, iat, exp } = req.user;

        const result = await PredictionService.createPrediction(id ,initial_amount, n_years);

        return res.status(200).json(result);
    }

    static findReqHistoryPrediction = async (req, res) => {
        // const { page, limit } = req.query;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const min_amount = req.query.min_amount === undefined  ? null : Number(req.query.min_amount);
        const max_amount = req.query.max_amount === undefined  ? null : Number(req.query.max_amount);
        const min_years =  req.query.min_years === undefined   ? null : Number(req.query.min_years);
        const max_years =  req.query.max_years === undefined   ? null  :Number(req.query.max_years);

        if (
            Number.isNaN(page) ||
            Number.isNaN(limit) ||
            page < 1 ||
            limit < 1
        ) {
            throw new Error("Invalid pagination");
        }

        if (
            Number.isNaN(page) ||
            Number.isNaN(limit) ||
            Number.isNaN(min_amount) ||
            Number.isNaN(max_amount) ||
            Number.isNaN(min_years) ||
            Number.isNaN(max_years)
        ) {
            throw new Error("Need so send a number value");
        }

        const { id, email, role, iat, exp } = req.user;

        const result = await PredictionService.findReqHistoryPrediction(id, page, limit, min_amount, max_amount, min_years, max_years);

        return res.status(200).json(result);
    }

    static findResultHistoryByPredictionId = async (req, res) => {
        const user_id = req.user.id;
        const prediction_id = req.params.prediction_id;

        const result = await PredictionService.findResultHistoryByPredictionId(user_id, prediction_id);

        return res.status(200).json(result);
    }

    static findPredictionOverview = async (req, res) => {
        const { id } = req.user;

        const result = await PredictionService.findPredictionOverview(id);

        return res.status(200).json(result) 
    }

}

export default PredictionController;