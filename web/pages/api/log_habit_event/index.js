import conn from '../../../lib/db'

export default async (req, res) => {
    try {
        console.log("req nom", req.body)
        const query = "INSERT into habit_events(time,habit_id,unit_volume) VALUES(to_timestamp($1 / 1000.0), $2, $3);"
        const values = [req.body.time, req.body.habit_id, req.body.unit_volume]
        console.log("values", values)
        console.log("DET query", query)
        const result = await conn.query(
            query,
            values
        );
        console.log("DET ttt", result);
        res.status(200).json({ "status": "success" });
    } catch (error) {
        console.log(error);
    }
};