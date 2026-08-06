import pool from '../config/database.js';

class AuthRepository {

    static findByGoogleId = async (googleId) => {

        // TODO: SQL
        const result = await pool.query(
            `
            select *
            from users
            where google_id = $1
            `,
            [googleId]
        )

        return result.rows[0] ?? null;
    };

    static findById = async (id) => {

        // TODO: SQL
        const result = await pool.query(
            `
            select *
            from users
            where id = $1
            `,
            [id]
        )

        return result.rows[0] ?? null;
    };

    static createUser = async ({ google_id, email, name, picture }) => {

        // TODO: SQL
        const result = await pool.query(
            `
            insert into users (google_id, email, name, picture)
            values ($1, $2, $3, $4)
            returning *
            `,
            [google_id, email, name, picture]
        )

        return result.rows[0] ?? null;

    };

}

export default AuthRepository;