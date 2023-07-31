import conn from '../../../lib/db'

export default async (req, res) => {
    try {
        console.log("req nom", req.body)
        const query = "INSERT into habit_events(time,habit_id,unit_volume) VALUES(to_timestamp($1 / 1000.0), $2, $3);"
        const values = [Date.now(), "55a0f8e6-0f78-4de1-9673-32b95b167d07", 10]
        console.log("values", values)
        const result = await conn.query(
            query,
            values
        );
        console.log("ttt", result);
        res.status(200).json({ "status": "success" });
    } catch (error) {
        console.log(error);
    }
};