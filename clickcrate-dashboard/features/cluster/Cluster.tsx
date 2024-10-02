// features/cluster/Cluster.tsx
import { useState } from "react";
import { ClusterUiModal } from "./components/ClusterUiModal";
import { ClusterUiTable } from "./components/ClusterUiTable";
import { AppHero } from "@/components/Layout";

export default function ClusterFeature() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <AppHero
        title="Clusters"
        subtitle="Manage and select your Solana clusters"
      >
        <ClusterUiModal
          show={showModal}
          hideModal={() => setShowModal(false)}
        />
        <button
          className="btn btn-xs lg:btn-md btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add Cluster
        </button>
      </AppHero>
      <ClusterUiTable />
    </div>
  );
}
