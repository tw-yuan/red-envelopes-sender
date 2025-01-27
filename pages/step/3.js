import { useSearchParams } from "next/navigation";

export default function step3() {
    const searchParams = useSearchParams();
    let amount = searchParams.get("amount");

    return (
        <div className="container text-center mt-5">
            <h1>你抽到了 {amount} 元紅包！</h1>
            <h2>紅包為手動處理，要等段時間才會發ㄛ:D</h2>
        </div>
    );
}