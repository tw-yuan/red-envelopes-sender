import { useState } from 'react';
import { useRouter } from 'next/router';

export default function step1() {
    const [email, setemail] = useState('');
    const [name, setname] = useState('');
    const [bank_no, setbank_no] = useState('');
    const [bank_account, setbank_account] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('送出中...');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, bank_no, bank_account }),
            });

            if (response.ok) {
                setSuccess('請到電子郵件收信完成抽紅包！');
            } else {
                const data = await response.json();
                if (data.message === '序號錯誤') {
                    router.push('/');
                }
                setSuccess('');
                setError(data.message || '驗證失敗');
            }
        } catch (err) {
            setSuccess('');
            setError('伺服器錯誤');
            console.error('Error:', err);
        }
    };

    return (
        <div className="container">
            <h1 className="mt-4 mb-4">抽紅包前先寫資料</h1>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">電子郵件：</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setemail(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">輸入一個我可以認出你是誰ㄉ暱稱：</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setname(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="bank_no" className="form-label">收紅包用ㄉ銀行代碼：</label>
                    <input type="number" max="999" min="1" className="form-control" id="bank_no" value={bank_no} onChange={(e) => setbank_no(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="bank_account" className="form-label">收紅包用ㄉ銀行帳號：</label>
                    <input type="number" className="form-control" id="bank_account" value={bank_account} onChange={(e) => setbank_account(e.target.value)} required/>
                </div>
                {/*
                <div className="mb-3">
                    <label htmlFor="gay_1" className="form-label">我同意我是臭甲。</label>
                    <select className="form-control" id="gay_1">
                        <option value="1">是，我同意我是臭甲。</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="gay_2" className="form-label">我發自內心承認我是甲。</label>
                    <select className="form-control" id="gay_2">
                        <option value="1">是，我發自內心承認我是甲。</option>
                    </select>
                </div>
                 */}
                <button type="submit" className="btn btn-primary">
                    開始抽紅包
                </button>

            </form>
        </div>
    );
}
