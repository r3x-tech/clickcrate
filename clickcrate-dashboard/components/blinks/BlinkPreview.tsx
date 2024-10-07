import React from "react";
import { Action, Blink } from "@dialectlabs/blinks";

interface BlinkPreviewProps {
  clickcrateId: string;
  action: Action | null;
}

export const BlinkPreview: React.FC<BlinkPreviewProps> = ({ action }) => {
  if (!action) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-sm text-red-500">Failed to load action</p>
      </div>
    );
  }

  return (
    <div className="blink-preview">
      <Blink
        action={action}
        websiteText={new URL(action.url).hostname}
        websiteUrl={`https://discover.clickcrate.xyz/?action=solana-action:${action.url}`}
        securityLevel="all"
        stylePreset="x-dark"
      />
    </div>
  );
};
