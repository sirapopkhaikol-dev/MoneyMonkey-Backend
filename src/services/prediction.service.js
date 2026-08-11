import axios from "axios";
import PredictionRepository from "../repositories/prediction.repository.js";
import pool from "../config/database.js";

class PredictionService {

    static createPrediction = async ( 
        user_id,
        initial_amount,
        n_years
     ) => {

        // Call Flask
        const predictions_response = await axios.post(
            'http://127.0.0.1:5050/predict',
            {
                n_years: n_years,
                initial_amount: initial_amount 
            },
            {
                headers: { "Content-Type" : 'application/json'}
            }
        )

        // Receive prediction list prediction[]
        const predictions_response_array = predictions_response.data

        if (predictions_response_array.length === 0) {
            throw new Error("Model returned no predictions.");
        }

        const client = await pool.connect()
        let rowCount
        
        try {
            await client.query("BEGIN")

            // Save Request
            const save_prediction_request_id = await PredictionRepository.createPredictionRequest(
                client,
                user_id,
                initial_amount,
                n_years
            );

            const request_id = save_prediction_request_id.id

            // Save Results
            const save_prediction_results_rowCount = await PredictionRepository.bulkCreatePredictionResults(
                client,
                request_id,
                predictions_response_array
            )
            rowCount = save_prediction_results_rowCount

            await client.query("COMMIT");
            
        } 
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }

        return {
            success: true,
            message: "Prediction Saved Successfully",
            data: {
                rowCount : rowCount,
                predictions: predictions_response_array
            }
        }

    }

    static findReqHistoryPrediction = async(
        user_id,
        page,
        limit,
        min_amount,
        max_amount,
        min_years,
        max_years
    ) => {

        const findHistory = await PredictionRepository.findReqHistoryPrediction(user_id, limit, page, min_amount, max_amount, min_years, max_years);
        const totalRows = await PredictionRepository.findTotalRows(user_id);

        return {
            success: true,
            message: "Search Prediction Request Successfully",
            pagination: {
                page: page,
                limit: limit,
                totalRows: totalRows
            },
            range: {
                min_amount: min_amount,
                max_amount: max_amount,
                min_years: min_years,
                max_years: max_years,
            },
            data: {
                rowCount : findHistory.rowCount,
                predictions: findHistory.rows
            }
        }

    }

    static findResultHistoryByPredictionId = async(
        user_id,
        prediction_id
    ) => {
        const findHistory = await PredictionRepository.findResultHistoryByPredictionId(user_id, prediction_id);

        if (findHistory.rowCount === 0) { throw new Error("prediction not found."); }

        let formatResult = {
            prediction_id: findHistory.rows[0].prediction_id,
            initial_amount: findHistory.rows[0].initial_amount,
            n_years: findHistory.rows[0].n_years,
            created_at: findHistory.rows[0].created_at,
            results:[]
        }   
        
        findHistory.rows.forEach(prediction => {
            formatResult.results.push({
                year: prediction.year,
                inflation_rate: prediction.inflation_rate,
                amount: prediction.amount
            })
        });

        return {
            success: true,
            message: "Search Prediction Result Successfully",
            data: {
                rowCount : findHistory.rowCount,
                predictions: formatResult
            }
            
        }

    }

    static findPredictionOverview = async(
        user_id
    ) => {

        const overView = await PredictionRepository.findPredictionOverview(user_id);

        if (findHistory.rowCount === 0) { throw new Error("prediction not found."); }

        

        return {
            success: true,
            message: "Search Prediction Result Successfully",
            data: {
                rowCount : findHistory.rowCount,
                predictions: formatResult
            }
            
        }

    }

}

export default PredictionService;