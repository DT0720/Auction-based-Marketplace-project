import pool from "../../lib/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        // Fetch all users from the database
        const [rows] = await pool.query('SELECT * FROM users');
        
        // Respond with the fetched data
        res.status(200).json({ users: rows });
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }