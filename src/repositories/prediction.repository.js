import pool from "../config/database.js";

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

    static findReqHistoryPrediction = async (
        user_id,
        limit,
        page,
        min_amount,
        max_amount,
        min_years,
        max_years
    ) => {
        // if page = 7, limit = 15. it mean we must skip first 6 page = 15 * 6 = 90 rows
        const offset = limit * (page - 1);
        // TODO: SQL
        const result = await pool.query(
            `
            select pr.id, pr.initial_amount, pr.n_years, pr.created_at
            from prediction_request as pr
            where pr.user_id = $1
                and ($2::numeric is null or pr.initial_amount >= $2::numeric)
                and ($3::numeric is null or pr.initial_amount <= $3::numeric)
                and ($4::integer is null or pr.n_years >= $4::integer)
                and ($5::integer is null or pr.n_years <= $5::integer)
            order by pr.created_at desc, pr.id desc
            limit $6
            offset $7
            `,
            [user_id, min_amount, max_amount, min_years, max_years, limit, offset]
        )

        return {
            rows: result.rows ?? null,
            rowCount: result.rowCount
        }
    };

    static findTotalRowsFiltered = async (
        user_id,
        min_amount,
        max_amount,
        min_years,
        max_years
    ) => {
        // TODO: SQL
        const result = await pool.query(
            `
            select count(*) as total
            from prediction_request as pr
            where pr.user_id = $1
                and ($2::numeric is null or pr.initial_amount >= $2::numeric)
                and ($3::numeric is null or pr.initial_amount <= $3::numeric)
                and ($4::integer is null or pr.n_years >= $4::integer)
                and ($5::integer is null or pr.n_years <= $5::integer)
            `,
            [user_id, min_amount, max_amount, min_years, max_years]
        )

        return {
            rowCount: Number(result.rows[0].total)
        }
    };

    static findTotalRows = async (
        user_id,
    ) => {

        // TODO: SQL
        const result = await pool.query(
            `
            select count(*) as total_count
            from prediction_request as pr
            where pr.user_id = $1
            `,
            [user_id]
        )
        return Number(result.rows[0].total_count) ?? null
        
    };

    static findRange = async (
        user_id, 
    ) => {
        const result = await pool.query(
            `
            select 
                min(pr.initial_amount) as min_amount,
                max(pr.initial_amount) as max_amount,
                min(pr.n_years) as min_years,
                max(pr.n_years) as max_years
            from prediction_request as pr
            where pr.user_id = $1
            `,
            [user_id]
        )    
    
        return result.rows[0] ?? null

    }

    static findResultHistoryByPredictionId = async (
        user_id,
        prediction_id
    ) => {

        // TODO: SQL
        const result = await pool.query(
            `
            select 
                rq.id as prediction_id, 
                rq.initial_amount, 
                rq.n_years, 
                rq.created_at, 
                rs.id as result_id, 
                rs.year, 
                round(rs.inflation_rate, 4) as inflation_rate, 
                rs.amount 
            from prediction_request as rq
            join prediction_result as rs
                on rq.id = rs.request_id
            where rq.user_id = $1 and rq.id = $2
            order by rs.year asc
            `,
            [user_id, prediction_id]
        )

        return {
            rows: result.rows ?? null,
            rowCount: result.rowCount
        }
        
    };

    static findPredictionOverview = async (
        user_id
    ) => {

        // TODO: SQL
        const result = await pool.query(
            `
            select 
                rq.id as prediction_id,
                rq.initial_amount,
                rq.n_years,
                rq.created_at,
                count(rs.id) as result_count,
                avg(rs.inflation_rate) as average_inflation,
                max(rs.inflation_rate) as highest_inflation,
                max(rs.amount)
            from prediction_request as rq
            left join prediction_result as rs
                on rq.id = rs.request_id
            where rq.user_id = $1
            group by rq.id
            having count(rs.id) > 1 and count(rs.id) < 150
            order by rq.created_at desc
            `,
            [user_id]
        );

        return result.rows

    };

}

export default PredictionRepository;