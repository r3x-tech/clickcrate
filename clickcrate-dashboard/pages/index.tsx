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
import AccountFeature from "@/features/account/Account";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/solana/solana-provider";

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
        borderColor: "rgb(10, 92, 255)",
        tension: 0.1,
      },
    ],
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-6">
      <div className="text-lg font-bold">Earnings</div>

      <div className="flex justify-between items-end my-4">
        <div className="text-sm font-normal py-2 px-4 rounded-full bg-quaternary">
          Lifetime: $5000
        </div>
        <div className="text-sm font-normal py-2 px-4 rounded-full bg-quaternary">
          Pending: $2000
        </div>
        <div className="flex px-4 pl-4 pr-0 rounded-full bg-quaternary space-x-4 items-center">
          <div className="text-sm font-normal ">Available: $3000</div>
          <button className="btn btn-xs lg:btn-sm btn-primary py-2 w-[10rem]">
            Cashout
          </button>
        </div>
      </div>
      <div className="bg-quaternary p-4 rounded-lg mb-4">
        <h2 className="text-sm font-normal">Earnings Over Time</h2>
        <Line data={chartData} className="max-h-[30vh]" />
      </div>
      <div className="flex flex-col justify-start items-start my-6 space-y-2">
        <div className="text-lg font-bold">Account Info</div>
        <AccountFeature />
      </div>
    </div>
  );
}
