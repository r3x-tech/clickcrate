import { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { bundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import {
  createSignerFromKeypair,
  signerIdentity,
  KeypairSigner,
} from "@metaplex-foundation/umi";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { createGenericFile } from "@metaplex-foundation/umi";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const createUmiUploader = (network: "devnet" | "mainnet") => {
  const rpcUrl =
    network === "devnet"
      ? process.env.SOLANA_DEVNET_RPC_URL
      : process.env.SOLANA_MAINNET_RPC_URL;

  if (!rpcUrl) {
    throw new Error("RPC URL not configured");
  }
  const solanaConnection = new Connection(rpcUrl, "confirmed");
  return createUmi(solanaConnection).use(mplCore()).use(bundlrUploader());
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const fileArray = files.file;
      if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
        return res.status(400).json({ error: "No file provided" });
      }

      const file = fileArray[0];

      const umi = createUmiUploader("devnet");
      const secretKeyUint8Array = bs58.decode(process.env.SERVER_WALLET_SK!);
      const userWallet = Keypair.fromSecretKey(
        Uint8Array.from(secretKeyUint8Array)
      );
      const serverWallet = umi.eddsa.createKeypairFromSecretKey(
        userWallet.secretKey
      );
      const serverSigner: KeypairSigner = createSignerFromKeypair(
        umi,
        serverWallet
      );
      umi.use(signerIdentity(serverSigner));

      const buffer = fs.readFileSync(file.filepath);
      const genericFile = createGenericFile(
        buffer,
        file.originalFilename || "unnamed"
      );
      const [uri] = await umi.uploader.upload([genericFile]);

      res.status(200).json({ uri });
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
}
