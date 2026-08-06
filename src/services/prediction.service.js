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

}

export default PredictionService;