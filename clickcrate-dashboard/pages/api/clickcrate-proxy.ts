import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, Method } from "axios";

async function getApiKey(walletAddress: string): Promise<string | null> {
  try {
    const UNKEY_SERVER_KEY = process.env.UNKEY_SERVER_KEY;
    const UNKEY_API_ID = process.env.UNKEY_API_ID;

    if (!UNKEY_SERVER_KEY || !UNKEY_API_ID) {
      throw new Error("Missing Unkey configuration");
    }

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
  const CLICKCRATE_API_URL = process.env.CLICKCRATE_API_URL;

  if (!CLICKCRATE_API_URL) {
    console.error("CLICKCRATE_API_URL is not set");
    return res.status(500).json({ message: "Server configuration error" });
  }

  const { walletAddress, endpoint, method, params } = req.body;

  if (!walletAddress || !endpoint) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const apiKey = await getApiKey(walletAddress);

  if (!apiKey) {
    return res.status(401).json({ message: "Unable to retrieve API key" });
  }

  try {
    console.log(
      `Sending ${method} request to: ${CLICKCRATE_API_URL}${endpoint}`
    );

    const axiosConfig: AxiosRequestConfig = {
      method: method as Method,
      url: `${CLICKCRATE_API_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    };
    axiosConfig.data = params;

    const response = await axios(axiosConfig);

    // console.log("ClickCrate API Response:", response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error in ClickCrate API request:", error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "An error occurred" });
    }
  }
}
