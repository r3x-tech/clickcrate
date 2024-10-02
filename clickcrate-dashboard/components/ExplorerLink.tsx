// components/ExplorerLink.tsx
import React from "react";
import { useCluster } from "../features/cluster/hooks/useCluster";

interface ExplorerLinkProps {
  path: string;
  label: string;
  className?: string;
}

export function ExplorerLink({ path, label, className }: ExplorerLinkProps) {
  const { getExplorerUrl } = useCluster();
  return (
    <a
      href={getExplorerUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      className={className || "link font-sans font-normal tracking-wide"}
    >
      {label}
    </a>
  );
}
