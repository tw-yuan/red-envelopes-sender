import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function step2() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const activity_key = searchParams.get("activity_key");
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);

    const handleRedEnvelopeClick = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/random_env_amount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: id, activity_key: activity_key }),
            }
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                alert(data.message);
            } else {
                setAmount(data.amount)
                alert(`你抽到了 ${data.amount} 元紅包！`);
                router.push('/step/3?amount=' + data.amount);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { }, [id]);

    return (
        <div className="container text-center mt-5">
            <h1>點擊領取紅包</h1>
            <div className="red-envelope" onClick={handleRedEnvelopeClick} style={{ cursor: "pointer" }} disabled={loading} >
                <img src="https://cdn-file.yuan-tw.net/13a996cd.png" alt="red-envelopes" className="red-envelope-icon img-fluid"/>
                {loading && <div className="spinner-border text-primary mt-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>}
            </div>
        </div>
    );
}
