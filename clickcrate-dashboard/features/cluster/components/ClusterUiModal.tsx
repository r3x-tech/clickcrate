// features/cluster/components/ClusterUiModal.tsx
import { useState } from "react";
import { Connection } from "@solana/web3.js";
import { useCluster, ClusterNetwork } from "../hooks/useCluster";
import { AppModal } from "@/components/UiLayout";

export function ClusterUiModal({
  hideModal,
  show,
}: {
  hideModal: () => void;
  show: boolean;
}) {
  const { addCluster } = useCluster();
  const [name, setName] = useState("");
  const [network, setNetwork] = useState<ClusterNetwork | undefined>();
  const [endpoint, setEndpoint] = useState("");

  return (
    <AppModal
      title={"Add Cluster"}
      hide={hideModal}
      show={show}
      submit={() => {
        try {
          new Connection(endpoint);
          if (name) {
            addCluster({ name, network, endpoint });
            hideModal();
          } else {
            console.log("Invalid cluster name");
          }
        } catch {
          console.log("Invalid cluster endpoint");
        }
      }}
      submitLabel="Save"
    >
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Endpoint"
        className="input input-bordered w-full"
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
      />
      <select
        className="select select-bordered w-full"
        value={network}
        onChange={(e) => setNetwork(e.target.value as ClusterNetwork)}
      >
        <option value={undefined}>Select a network</option>
        <option value={ClusterNetwork.Devnet}>Devnet</option>
        <option value={ClusterNetwork.Testnet}>Testnet</option>
        <option value={ClusterNetwork.Mainnet}>Mainnet</option>
      </select>
    </AppModal>
  );
}
