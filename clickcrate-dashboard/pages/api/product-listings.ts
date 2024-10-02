import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_BASE_URL = process.env.CLICKCRATE_API_URL;

const getApiKey = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  return authHeader ? authHeader.split(" ")[1] : null;
};

function handleApiError(error: unknown, res: NextApiResponse) {
  console.error("API Error:", error);
  if (axios.isAxiosError(error)) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data?.error || "Internal Server Error" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  const { query } = req;
  const endpoint = query.endpoint as string;

  try {
    switch (endpoint) {
      case "fetchOwnedListings":
        await fetchOwnedListings(req, res, apiKey);
        break;
      case "registerListing":
        await registerListing(req, res, apiKey);
        break;
      case "updateListing":
        await updateListing(req, res, apiKey);
        break;
      case "activateListing":
        await activateListing(req, res, apiKey);
        break;
      case "deactivateListing":
        await deactivateListing(req, res, apiKey);
        break;
      case "placeListing":
        await placeListing(req, res, apiKey);
        break;
      case "removeListing":
        await removeListing(req, res, apiKey);
        break;
      default:
        res.status(400).json({ error: "Invalid endpoint" });
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

async function fetchOwnedListings(
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) {
  const response = await axios.post(
    `${API_BASE_URL}/v1/product-listing/owned-listings`,
    { owner: req.body.owner },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  res.status(200).json(response.data);
}

async function registerListing(
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) {
  const response = await axios.post(
    `${API_BASE_URL}/v1/product-listing/register`,
    req.body,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  res.status(200).json(response.data);
}

async function updateListing(
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) {
  const response = await axios.put(
    `${API_BASE_URL}/v1/product-listing/update`,
    req.body,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  res.status(200).json(response.data);
}

async function activateListing(
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) {
  const response = await axios.post(
    `${API_BASE_URL}/v1/product-listing/activate`,
    { productListingId: req.body.productListingId },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  res.status(200).json(response.data);
}

async function deactivateListing(
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) {
  const response = await axios.post(
    `${API_BASE_URL}/v1/product-listing/deactivate`,
    { productListingId: req.body.productListingId },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  res.status(200).json(response.data);
}

async function placeListing(
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) {
  const response = await axios.post(
    `${API_BASE_URL}/v1/product-listing/place`,
    req.body,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  res.status(200).json(response.data);
}

async function removeListing(
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) {
  const response = await axios.post(
    `${API_BASE_URL}/v1/product-listing/remove`,
    req.body,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  res.status(200).json(response.data);
}
