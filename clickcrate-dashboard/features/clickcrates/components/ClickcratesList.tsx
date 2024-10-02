// // components/ClickcratesList.tsx

// import React, { useState, useEffect } from "react";
// import { PublicKey } from "@solana/web3.js";
// import { useWallet } from "@solana/wallet-adapter-react";

// import {
//   IconRefresh,
//   IconEdit,
//   IconShoppingCartFilled,
//   IconLink,
// } from "@tabler/icons-react";
// import toast from "react-hot-toast";
// import { useOwnedClickcrates } from "../hooks/useOwnedClickcrates";

// interface ClickcratesListProps {
//   onSelect: (account: PublicKey, selected: boolean) => void;
//   selectedClickCrates: PublicKey[];
// }

// export function ClickcratesList({
//   onSelect,
//   selectedClickCrates,
// }: ClickcratesListProps) {
//   const { publicKey } = useWallet();
//   const { clickcratesQuery, program } = useOwnedClickcrates();
//   const [isLoading, setIsLoading] = useState(false);
//   const [allSelected, setAllSelected] = useState(false);

//   useEffect(() => {
//     if (clickcratesQuery.isLoading) {
//       setIsLoading(true);
//     } else {
//       const timer = setTimeout(() => setIsLoading(false), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [clickcratesQuery.isLoading]);

//   useEffect(() => {
//     if (selectedClickCrates.length == 0) {
//       setAllSelected(false);
//     }
//   }, [selectedClickCrates.length]);

//   const handleRefetch = async () => {
//     setIsLoading(true);
//     await clickcratesQuery.refetch();
//     setIsLoading(false);
//   };

//   const handleAllSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isSelected = e.target.checked;
//     setAllSelected(isSelected);
//     userClickcrates?.forEach((clickcrate) => {
//       onSelect(clickcrate.publicKey, isSelected);
//     });
//   };

//   const userClickcrates = clickcratesQuery.data?.filter((clickcrate) =>
//     clickcrate.account.owner.equals(publicKey!)
//   );

//   if (isLoading) {
//     return (
//       <div className="flex justify-center w-[100%] p-6">
//         <span className="loading loading-spinner loading-md"></span>
//       </div>
//     );
//   }

//   if (!clickcratesQuery.data?.length) {
//     return (
//       <div className="mb-20 w-[100%] bg-background border-2 border-quaternary rounded-lg">
//         <p className="text-sm font-light text-center p-4">
//           No ClickCrates found. Register one to get started!
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-[100%] bg-background border-2 border-quaternary rounded-lg">
//       <button
//         id="refresh-clickcrates"
//         className="hidden"
//         onClick={handleRefetch}
//       >
//         Refresh
//       </button>
//       <div className="w-[100%] bg-background border-2 border-quaternary rounded-lg">
//         <div className="flex flex-row justify-start items-center w-[100%] px-4 pb-2 pt-2 border-b-2 border-quaternary">
//           <div className="flex flex-row w-[5%]">
//             <p className="text-start font-bold text-xs"></p>
//           </div>
//           <div className="flex flex-row w-[10%]">
//             <p className="text-start font-bold text-xs">ACCOUNT</p>
//           </div>
//           <div className="flex flex-row w-[10%]">
//             <p className="text-start font-bold text-xs">ID</p>
//           </div>
//           <div className="flex flex-row w-[10%]">
//             <p className="text-start font-bold text-xs">STATUS</p>
//           </div>
//           <div className="flex flex-row items-center w-[10%]">
//             <p className="text-start font-bold text-xs">CATEGORY</p>
//           </div>
//           <div className="flex flex-row w-[10%]">
//             <p className="text-start font-bold text-xs">ORIGIN</p>
//           </div>
//           <div className="flex flex-row w-[13%]">
//             <p className="text-start font-bold text-xs">CURRENT PLACEMENT</p>
//           </div>
//           <div className="flex flex-row w-[10%] justify-end">
//             <p className="text-end font-bold text-xs">UNIT PRICE</p>
//           </div>
//           <div className="flex flex-row w-[10%] justify-end">
//             <p className="text-end font-bold text-xs">STOCK</p>
//           </div>
//           <div className="flex flex-row w-[10%]"></div>
//         </div>
//       </div>
//     </div>
//   );
// }
