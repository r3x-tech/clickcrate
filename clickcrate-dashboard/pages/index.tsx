import { useWallet } from "@jup-ag/wallet-adapter";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const { connected } = useWallet();

  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Earnings",
        data: [1200, 1900, 3000, 5000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-[100vw]">
        <h1 className="text-lg">
          Please connect your wallet to view the dashboard
        </h1>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">Lifetime: $5000</div>
        <div className="text-lg font-bold">Available: $3000</div>
        <div className="text-lg font-bold">Pending: $2000</div>
        <button className="btn btn-xs lg:btn-sm btn-primary py-3 w-[10rem]">
          Cashout
        </button>
      </div>
      <div className="bg-quaternary p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Earnings Over Time</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
}
