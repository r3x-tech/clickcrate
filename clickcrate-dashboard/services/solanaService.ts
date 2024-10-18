import {
  Connection,
  SendTransactionError,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { RateLimiter } from "limiter";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const limiter = new RateLimiter({ tokensPerInterval: 40, interval: 10000 });

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await limiter.removeTokens(1);
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  throw new Error("Max retries reached");
}

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

async function confirmTransaction(
  connection: Connection,
  signature: TransactionSignature,
  timeout: number = 120000,
  pollInterval: number = 1000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      console.log(`Checking transaction status for ${signature}...`);
      const { value: statuses } = await retryWithExponentialBackoff(() =>
        connection.getSignatureStatuses([signature])
      );
      if (!statuses || statuses.length === 0) {
        console.log("Failed to get signature status, retrying...");
        await sleep(pollInterval);
        continue;
      }
      const status = statuses[0];
      if (status === null) {
        console.log("Transaction status is null, waiting...");
        await sleep(pollInterval);
        continue;
      }
      if (status.err) {
        console.error(`Transaction failed: ${JSON.stringify(status.err)}`);
        return false;
      }
      if (
        status.confirmationStatus === "confirmed" ||
        status.confirmationStatus === "finalized"
      ) {
        console.log(
          `Transaction confirmed with status: ${status.confirmationStatus}`
        );
        return true;
      }
      console.log(`Current status: ${status.confirmationStatus}, waiting...`);
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }
    await sleep(pollInterval);
  }
  console.error(`Transaction confirmation timeout after ${timeout}ms`);
  return false;
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
    console.log("Transaction before signing:", {
      version: transaction.version,
      messageVersion: transaction.message.version,
      recentBlockhash: transaction.message.recentBlockhash,
      instructionsCount: transaction.message.compiledInstructions.length,
    });

    // Log all account keys
    const accountKeys = transaction.message.getAccountKeys();
    console.log(
      "Transaction account keys:",
      Array.from({ length: accountKeys.length }, (_, index) => ({
        index,
        publicKey: accountKeys.get(index)?.toBase58() || "Unknown",
      }))
    );

    console.log("Signing transaction...");
    const signedTransaction = await wallet.signTransaction(transaction);
    console.log("Transaction signed ");

    console.log(
      "Transaction signatures:",
      signedTransaction.signatures
        .map((sig, index) => ({
          index,
          publicKey: accountKeys.get(index)?.toBase58() || "Unknown",
          signature: Buffer.from(sig).toString("base64"),
        }))
        .filter((signer) => !signer.signature.startsWith("AAAA")) // Filter out empty signatures
    );

    const serializedTransaction = signedTransaction.serialize();
    console.log("Transaction serialized");

    console.log("Transaction size (bytes):", serializedTransaction.length);

    console.log("Sending transaction...");
    const txId = await retryWithExponentialBackoff(async () => {
      const tokensBefore = limiter.getTokensRemaining();
      console.log(`Tokens before sending: ${tokensBefore}`);
      try {
        const result = await connection.sendRawTransaction(
          serializedTransaction,
          {
            skipPreflight: false,
            preflightCommitment: "confirmed",
            maxRetries: 3,
          }
        );
        console.log("Raw transaction sent ");
        console.log("Transaction ID:", result);
        return result;
      } catch (sendError) {
        console.error("Error sending raw transaction:", sendError);
        throw sendError;
      }
    });

    console.log("Transaction sent with ID:", txId);

    if (
      txId ===
      "1111111111111111111111111111111111111111111111111111111111111111"
    ) {
      throw new Error("Invalid transaction ID received");
    }

    console.log("Waiting for confirmation...");
    const confirmed = await confirmTransaction(connection, txId, 120000);

    if (confirmed) {
      console.log("Transaction confirmed ");
      return txId;
    } else {
      throw new Error(
        "Transaction failed to confirm within the timeout period"
      );
    }
  } catch (error) {
    console.error("Error in signAndSendVersionedTransaction:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    if (error instanceof SendTransactionError) {
      console.error("SendTransactionError details:", error.logs);
    }
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
