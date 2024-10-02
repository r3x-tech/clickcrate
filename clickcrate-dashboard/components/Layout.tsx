// components/Layout.tsx
import { ClusterChecker } from "@/features/cluster/components/ClusterChecker";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { AccountChecker } from "@/features/account/components/AccountChecker";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          {children}
        </main>
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
