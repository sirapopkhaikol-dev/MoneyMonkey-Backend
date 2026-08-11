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
        const min_amount = req.query.min_amount !== undefined  ? Number(req.query.min_amount) : null ;
        const max_amount = req.query.max_amount !== undefined  ? Number(req.query.max_amount) : null;
        const min_years =  req.query.min_years !== undefined   ? Number(req.query.min_years) : null;
        const max_years =  req.query.max_years !== undefined   ? Number(req.query.max_years) : null;

        if (
            page === NaN || 
            limit === NaN || 
            min_amount === NaN || 
            max_amount === NaN ||
            min_years === NaN ||
            max_years === NaN
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