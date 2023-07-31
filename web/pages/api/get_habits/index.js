import conn from '../../../lib/db'

export default async (req, res) => {
    try {
        console.log("req nom", req.body)
        const query = "SELECT * from habits;" 
        const values = []
      const result = await conn.query(
          query,
          values
      );
      console.log( "ttt",result );
      res.status(200).json( result.rows );
  } catch ( error ) {
      console.log( error );
  }
  };