import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const UNKEY_SERVER_KEY = process.env.UNKEY_SERVER_KEY;
const CURRENT_CLICKCRATE_API_URL = process.env.CLICKCRATE_API_URL;
const UNKEY_API_ID = "api_Wswb2GTEbv5cv5VrtVwDXZ7qhAX";

async function getApiKey(walletAddress: string): Promise<string | null> {
  try {
    const response = await axios.get(`https://api.unkey.dev/v1/apis.listKeys`, {
      params: {
        apiId: UNKEY_API_ID,
        externalId: walletAddress,
        decrypt: true,
        revalidateKeysCache: true,
      },
      headers: {
        Authorization: `Bearer ${UNKEY_SERVER_KEY}`,
      },
    });

    if (response.data.keys && response.data.keys.length > 0) {
      return response.data.keys[0].plaintext;
    }
  } catch (error) {
    console.error("Error fetching API key:", error);
  }

  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { walletAddress, endpoint, params } = req.body;

  if (!walletAddress || !endpoint) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const apiKey = await getApiKey(walletAddress);

  if (!apiKey) {
    return res.status(401).json({ message: "Unable to retrieve API key" });
  }

  try {
    const response = await axios({
      method: "POST",
      url: `${CURRENT_CLICKCRATE_API_URL}${endpoint}`,
      data: params,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "An error occurred" });
    }
  }
}
