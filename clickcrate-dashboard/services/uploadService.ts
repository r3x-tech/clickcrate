import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { createGenericFile } from "@metaplex-foundation/umi";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { Connection } from "@solana/web3.js";

export const createUmiUploader = (
  wallet: WalletContextState,
  network: "devnet" | "mainnet"
) => {
  const rpcUrl =
    network === "devnet"
      ? process.env.NEXT_PUBLIC_DEVNET_RPC_URL
      : process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
  const solanaConnection = new Connection(rpcUrl!, "confirmed");
  const umi = createUmi(solanaConnection)
    .use(mplCore())
    .use(irysUploader())
    .use(walletAdapterIdentity(wallet));
  return umi;
};

const extensionToMimeType: { [key: string]: string } = {
  // Images
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",

  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text
  txt: "text/plain",
  rtf: "application/rtf",
  csv: "text/csv",

  // Web
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  xml: "application/xml",

  // Audio
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",

  // Video
  mp4: "video/mp4",
  avi: "video/x-msvideo",
  mpeg: "video/mpeg",
  webm: "video/webm",

  // Archives
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",

  // Other
  bin: "application/octet-stream",
};

const getContentType = (file: File): string => {
  if (file.type) {
    return file.type;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension && extension in extensionToMimeType) {
    return extensionToMimeType[extension];
  }

  throw new Error(`Unable to determine content type for file: ${file.name}`);
};

export const uploadFile = async (
  file: File,
  wallet: WalletContextState,
  network: "devnet" | "mainnet"
): Promise<string> => {
  const umi = createUmiUploader(wallet, network);

  // Convert File to Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Get file extension
  const extensionMatch = file.name.match(/\.([^.]+)$/);
  const extension = extensionMatch ? extensionMatch[1] : undefined;

  // Get content type
  let contentType: string;
  try {
    contentType = getContentType(file);
  } catch (error) {
    console.error(error);
    throw new Error("File upload failed: Unable to determine content type.");
  }

  // Create GenericFile
  const genericFile = createGenericFile(uint8Array, file.name, {
    contentType: contentType,
    extension: extension,
  });

  try {
    const [uri] = await umi.uploader.upload([genericFile]);
    return uri;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
