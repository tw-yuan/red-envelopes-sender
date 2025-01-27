import pool from "../../src/module/db";
import transporter from "../../src/module/mail";
import { encrypt } from "../../src/module/crypto";
const email_from = require('../../config.json');

export default async function handler(req, res) {
    const activity_key = req.cookies.activity_key;
    const email = req.body.email;
    const name = req.body.name;
    const bank_no = req.body.bank_no;
    const bank_account = req.body.bank_account;
    if (activity_key == '' || email == '' || name == '' || bank_no == '' || bank_account == '') {
        res.status(404).json({ message: "請填寫完整" });
    }
    let amount2 = 0;

    const [rows] = await pool.query("SELECT * FROM config WHERE activity_key = ?", [activity_key]);
    const [rows1] = await pool.query("SELECT * FROM record WHERE email = ?", [email]);

    if (rows1.length != 0) {
        amount2 = 1;
    }
    if (rows.length === 0 || rows[0].bal_amount === 0 || rows[0].bal_red_env === 0 || amount2 != 0) {
        res.status(404).json({ message: "序號錯誤或紅包已發完或您已參加過本活動" });
    } else {
        res.setHeader("Set-Cookie", `activity_key=${activity_key}; Path=/`);
        const [rows] = await pool.query("INSERT INTO record (email, name, bank_id, bank_account, status, amount) VALUES (?, ?, ?, ?, ?, ?)", [email, name, bank_no, bank_account, "waiting", 0]);
        const crypto_email = encrypt(email);
        const crypto_activity_key = encrypt(activity_key);
        await transporter.sendMail({
            from: email_from.email.user,
            to: email,
            subject: '紅包抽抽樂連結',
            text: `您的連結為: https://red-env.yuan-tw.net/step/2?id=${crypto_email}&activity_key=${crypto_activity_key}`,
        });
        res.status(200).json({ message: "登入成功" });
    }
}