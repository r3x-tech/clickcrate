// components/UiLayout.tsx
import React, { ReactNode, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ClusterUiSelect } from "../features/cluster/components/ClusterUiSelect";
import { ExplorerLink } from "./ExplorerLink";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      <div className="navbar bg-background text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0 px-[4vw]">
        <div
          style={{
            backgroundImage: "url('/background.svg')",
            backgroundSize: "auto auto",
          }}
          className="absolute inset-0 bg-background bg-cover bg-center bg-repeat-y -z-10"
        ></div>
        <div className="flex-1">
          <Link
            className="btn btn-ghost text-xl bg-none ml-[-1vw] bg-[#000000] hover:bg-[#000000]"
            style={{ backgroundColor: "#000000" }}
            href="https://clickcrate.r3x.tech/"
            target="_blank"
            rel="noopener noreferrer"
            passHref
          >
            <Image
              src="/clickcrate-logo-small.svg"
              alt="clickcrate logo"
              width={120}
              height={80}
            />
          </Link>
          <ul className="menu menu-vertical sm:menu-horizontal px-2 space-x-4 font-semibold justify-center w-full">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={`${
                    pathname.startsWith(path)
                      ? "active underline decoration-4 underline-offset-8 decoration-primary"
                      : ""
                  }`}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-none space-x-2">
          <UnifiedWalletButton />
          <ClusterUiSelect />
        </div>
      </div>
      <div className="flex-grow mx-auto w-full px-[4vw] relative overflow-y-auto">
        {children}
        <Toaster position="top-center" />
      </div>
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
      <div className=" flex flex-col">
        <div className="flex flex-row justify-center">
          <button
            className="btn btn-xs btn-ghost p-0 m-0"
            onClick={() => toast.dismiss(toastId)}
          >
            DISMISS
          </button>
        </div>
        <div className="flex flex-col justify-center items-center pt-0 mt-0">
          <div className="text-md justify-center text-center mb-[1px]">
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
