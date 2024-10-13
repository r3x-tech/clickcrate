import React, { ReactNode, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import { ClusterChecker } from "@/features/cluster/components/ClusterChecker";
import { AccountChecker } from "@/features/account/components/AccountChecker";
import { ExplorerLink } from "./ExplorerLink";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <div
        style={{
          backgroundImage: "url('/background.svg')",
          backgroundSize: "auto auto",
        }}
        className="absolute inset-0 bg-background bg-cover bg-center bg-repeat-y -z-10"
      ></div>
      <Header />
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      <main className="flex-grow overflow-x-hidden overflow-y-auto px-[4vw]">
        {children}
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5 bg-background border-2 border-white">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="py-[20px] w-[100%] flex flex-row items-center align-center justify-center ">
      <div className="flex flex-row items-center align-center justify-center text-center w-[92vw] p-0 gap-[1rem]">
        <div className="w-[100%]">
          {typeof title === "string" ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function useTransactionToast() {
  return (signature: string) => {
    const toastId = toast.success(
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <button
            className="btn btn-xs btn-ghost p-0 m-0 text-xs"
            onClick={() => toast.dismiss(toastId)}
          >
            DISMISS
          </button>
        </div>
        <div className="flex flex-col justify-center items-center pt-0 mt-2">
          <div className="text-xs justify-center text-center mb-2">
            Transaction sent!
          </div>
          <ExplorerLink
            path={`tx/${signature}`}
            label={"View Transaction"}
            className="btn btn-xs btn-primary"
          />
        </div>
      </div>,
      {
        duration: 10000,
      }
    );
  };
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) +
      "..." +
      str.substring(str.length - len, str.length)
    );
  }
  return str;
}
