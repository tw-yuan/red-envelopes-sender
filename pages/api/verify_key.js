import pool from "../../src/module/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { activity_key } = req.body;
        const [rows] = await pool.query('SELECT * FROM config WHERE activity_key = ?', [activity_key]);
        if (rows.length === 0 || rows[0].bal_amount === 0 || rows[0].bal_red_env === 0) {
            res.status(404).json({ message: '序號錯誤或紅包已發完' });
        } else {
            res.setHeader('Set-Cookie', `activity_key=${activity_key}; Path=/`);
            res.status(200).json({ message: '登入成功' });
        }
    } else {
        res.status(405).json({ message: '不支援的方法' });
    }
}