class PredictionRepository {

    static createPredictionRequest = async (
        client,
        user_id,
        initial_amount,
        n_years
    ) => {
        // TODO: SQL
        const result = await client.query(
            `
            insert into prediction_request(user_id, initial_amount, n_years)
            values ($1, $2, $3)
            returning id
            `,
            [user_id, initial_amount, n_years]
        )

        return result.rows[0] ?? null;

    };

    static bulkCreatePredictionResults = async (
        client,
        request_id,
        predictions
    ) => {

        // TODO: SQL
        let value$_array = []

        predictions.forEach((predictions, index) => {

            const endNum = (index + 1) * 4
            value$_array.push(
                `($${endNum - 3}, $${endNum - 2}, $${endNum - 1}, $${endNum})`
            )
            
        });

        const value$_string = value$_array.join(",");

        const values = predictions.flatMap(prediction => [request_id, prediction.year, prediction.inflation_rate, prediction.amount])

        const result = await client.query(
            `
            insert into prediction_result(request_id, year, inflation_rate, amount)
            values ${value$_string}
            `,
            values
        )

        return result.rowCount;

    };

    static findPredictionHistory = async () => {

        // TODO: SQL


    };

    static findPredictionById = async () => {

        // TODO: SQL


    };

}

export default PredictionRepository;