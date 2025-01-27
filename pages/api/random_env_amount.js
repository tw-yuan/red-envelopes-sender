import pool from "../../src/module/db";
import { decrypt } from "../../src/module/crypto";

export default async function handler(req, res) {
    const activity_key = decrypt(req.body.activity_key);
    const email = decrypt(req.body.userid);
    let amount2 = 0;
    const [rows] = await pool.query("SELECT * FROM config WHERE activity_key = ?", [activity_key]);
    const [rows1] = await pool.query("SELECT * FROM record WHERE email = ?", [email]);
    if (rows1.length != 0) {
        amount2 = rows1[0].amount;
    }
    if (rows.length === 0 || rows[0].bal_amount === 0 || rows[0].bal_red_env === 0 || amount2 != 0 || email === '') {
        res.status(404).json({ message: "序號錯誤或紅包已發完或您已參加過本活動" });
    } else {
        let bal_red_env = rows[0].bal_red_env;
        let bal_amount = rows[0].bal_amount;
        const red_env_max = rows[0].red_env_max;
        const red_env_min = rows[0].red_env_min;
        let max = 0;
        let min = 0;
        let amount = 0;
        if (bal_red_env === 1) {
            amount = bal_amount;
            const [row] = await pool.query("UPDATE config SET bal_red_env = 0, bal_amount = 0 WHERE activity_key = ?", [activity_key]);
            const [row1] = await pool.query("UPDATE record SET status = 'prize', amount = ? WHERE email = ?", [amount, email]);
            res.status(200).json({ message: "登入成功", amount: amount });
        } else if(bal_amount < red_env_max) {
            max = bal_amount;
            min = red_env_min;
            amount = Math.floor(Math.random() * (max - min + 1)) + min;
            bal_amount = bal_amount - amount;
            bal_red_env = bal_red_env - 1;
            const [row] = await pool.query("UPDATE config SET bal_amount = ? , bal_red_env = ? WHERE activity_key = ?", [bal_amount, bal_red_env, activity_key]);
            const [row1] = await pool.query("UPDATE record SET status = 'prize', amount = ? WHERE email = ?", [amount, email]);
            res.status(200).json({ message: "登入成功", amount: amount });
        } else {
            max = red_env_max;
            min = red_env_min;
            amount = Math.floor(Math.random() * (max - min + 1)) + min;
            bal_amount = bal_amount - amount;
            bal_red_env = bal_red_env - 1;
            const [row] = await pool.query("UPDATE config SET bal_amount = ? , bal_red_env = ? WHERE activity_key = ?", [bal_amount, bal_red_env, activity_key]);
            const [row1] = await pool.query("UPDATE record SET status = 'prize', amount = ? WHERE email = ?", [amount, email]);
            res.status(200).json({ message: "登入成功", amount: amount });
        }
        res.status(200).json({ message: "登入成功" });
    }
}