import { Order } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  "https://clickcrate-api-dev-62979740970.us-central1.run.app/v1";

interface UpdateOrderStatusResponse {
  message: string;
  transaction: string;
}

export function useClickCrateOrders(creatorId: string | null) {
  const key = process.env.NEXT_PUBLIC_CC_API_KEY!;

  return useQuery<Order[], Error>({
    queryKey: ["clickcrate-orders", creatorId],
    queryFn: async () => {
      if (!key) {
        throw new Error("API key is not set.");
      }
      if (!creatorId) {
        return [];
      }
      const response = await axios.get<{ orders: Order[] }>(
        `${API_BASE_URL}/clickcrate/orders`,
        {
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          params: { creatorId },
        }
      );
      return response.data.orders;
    },
    retry: false,
    enabled: !!creatorId,
  });
}

export function useUpdateOrderStatus() {
  return useMutation<
    UpdateOrderStatusResponse,
    Error,
    { orderId: string; newStatus: Order["status"] }
  >({
    mutationFn: async ({ orderId, newStatus }) => {
      const response = await axios.put<UpdateOrderStatusResponse>(
        `${API_BASE_URL}/clickcrate/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_CC_API_KEY!}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => toast.success("Order status updated successfully"),
    onError: (error: Error) =>
      toast.error(`Failed to update order status: ${error.message}`),
  });
}
