import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

async function getRecentBlockhashWithRetry(
  connection: Connection,
  maxRetries = 3,
  delayMs = 1000
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("finalized");
      return { blockhash, lastValidBlockHeight };
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  console.error("Failed to get recent blockhash after retries");
  return undefined;
}

export const createConnection = (network: "devnet" | "mainnet") => {
  const rpcUrl =
    network === "devnet"
      ? process.env.SOLANA_DEVNET_RPC_URL
      : process.env.SOLANA_MAINNET_RPC_URL;

  if (typeof rpcUrl !== "string" || rpcUrl == undefined || !rpcUrl) {
    throw new TypeError("rpcUrl expected string");
  }
  return new Connection(rpcUrl, "confirmed");
};

export const signAndSendTransaction = async (
  transaction: Transaction,
  connection: Connection,
  wallet: WalletContextState
): Promise<string> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  try {
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    const confirmation = await connection.confirmTransaction(
      signature,
      "confirmed"
    );

    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${confirmation.value.err.toString()}`
      );
    }

    return signature;
  } catch (error) {
    console.error("Error in signAndSendTransaction:", error);
    throw error;
  }
};

export const signAndSendVersionedTransaction = async (
  transaction: VersionedTransaction,
  connection: Connection,
  wallet: WalletContextState
): Promise<string> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected");
  }

  try {
    const signedTransaction = await wallet.signTransaction(transaction);
    const serializedTransaction = signedTransaction.serialize();
    const txId = await connection.sendRawTransaction(serializedTransaction, {
      skipPreflight: true,
      maxRetries: 5,
    });
    const confirmation = await connection.confirmTransaction(txId, "confirmed");

    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${confirmation.value.err.toString()}`
      );
    }

    return txId;
  } catch (error) {
    console.error("Error in signAndSendVersionedTransaction:", error);
    throw error;
  }
};

export async function uploadImageToStorage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to upload image");
  }

  const data = await response.json();
  return data.uri;
}
