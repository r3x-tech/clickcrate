// features/cluster/components/ClusterUiSelect.tsx
import { Cluster, useCluster } from "../hooks/useCluster";

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster();
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-sm btn-outline py-4">
        {cluster.name}
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4 gap-2"
        style={{ border: "2px solid white" }}
      >
        {clusters.map((item: Cluster) => (
          <li key={item.name}>
            <button
              className={`btn btn-sm ${
                item.active ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setCluster(item)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
