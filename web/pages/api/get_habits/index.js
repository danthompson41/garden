import conn from '../../../lib/db'

export default async (req, res) => {
    try {
        console.log("req nom", req.body)
        const query = "SELECT habits.habit_name, SUM(unit_volume), habits.target/7 as daily_target, SUM(unit_volume)/(habits.target/7)*100 as daily_percent_complete, SUM(unit_volume)/(habits.target/7)*100 >= 100 as done FROM habit_events LEFT JOIN habits ON habit_events.habit_id=habits.habit_id WHERE time > date_trunc('week', now()) GROUP BY habits.habit_name, habits.target;" 
        const values = [req.body.content]
      const result = await conn.query(
          query,
          values
      );
      console.log( "ttt",result );
  } catch ( error ) {
      console.log( error );
  }
  
  
  };