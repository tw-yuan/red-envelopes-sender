import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from "next/navigation";


export default function Home() {
  const [activity_key, setactivity_key] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  useEffect(() => {
    if (key) {
      setactivity_key(key);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/verify_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activity_key }),
      });

      if (response.ok) {
          router.push('/step/1');
      } else {
          const data = await response.json();
          setError(data.message || '驗證失敗');
      }
    } catch (err) {
      setError('伺服器錯誤');
      console.error('Error:', err);
    }
  };

  return (
      <div className="container">
          <h1 className="mt-4 mb-4">紅包手氣抽抽樂</h1>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                  <label htmlFor="activity_key" className="form-label">
                      請輸入序號：
                  </label>
                  <input type="text" className="form-control" id="activity_key" value={activity_key} onChange={(e) => setactivity_key(e.target.value)}
                  />
              </div>
              <button type="submit" className="btn btn-primary">
                  驗證
              </button>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
      </div>
  );
}
