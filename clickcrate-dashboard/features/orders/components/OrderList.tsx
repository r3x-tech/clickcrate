import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  IconCheck,
  IconCopy,
  IconPackageExport,
  IconX,
} from "@tabler/icons-react";
import { Order } from "@/types";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/components/Layout";

export function OrdersList({
  orders,
  isLoading,
  error,
}: {
  orders?: Order[];
  isLoading: boolean;
  error: Error | null;
}) {
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-[100%] p-6 space-y-2">
        <span className="loading loading-spinner loading-md"></span>
        <p className="font-body text-xs font-semibold">LOADING</p>
      </div>
    );
  }

  if (error) {
    toast.error(`${error}`);
    return (
      <div className="mb-20 w-[100%] bg-background border-2 border-quaternary rounded-lg">
        <p className="text-sm font-light text-center p-4">
          Failed to fetch orders. Please try again.
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mb-20 w-[100%] bg-background border-2 border-quaternary rounded-lg">
        <p className="text-sm font-light text-center p-4">
          No orders found. Place an order to get started.
        </p>
      </div>
    );
  }

  const openFulfillModal = (order: Order) => {
    setSelectedOrder(order);
    setShowFulfillModal(true);
  };

  const closeFulfillModal = () => {
    setSelectedOrder(null);
    setShowFulfillModal(false);
  };

  const openCancelModal = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setSelectedOrder(null);
    setShowCancelModal(false);
  };

  return (
    <>
      <div className="flex flex-col w-full bg-background border-2 border-quaternary rounded-lg">
        <div className="flex flex-row justify-start items-center w-full px-4 pb-2 pt-2 border-b-2 border-quaternary">
          <div className="w-[15%]">
            <p className="text-start font-bold text-xs">ORDER ID</p>
          </div>
          <div className="w-[15%]">
            <p className="text-start font-bold text-xs">PRODUCT ID</p>
          </div>
          <div className="w-[15%]">
            <p className="text-start font-bold text-xs">BUYER ID</p>
          </div>
          <div className="w-[5%] text-right">
            <p className="font-bold text-xs">QUANTITY</p>
          </div>
          <div className="w-[15%] text-right">
            <p className="font-bold text-xs">TOTAL PRICE</p>
          </div>
          <div className="w-[7%] text-left ml-[8%]">
            <p className="font-bold text-xs">STATUS</p>
          </div>
          <div className="w-[20%] text-right"></div>
        </div>
        {orders.map((order, index) => (
          <div
            key={order.id}
            className={`flex flex-row justify-start items-center w-full px-4 py-2 ${
              index === orders.length - 1 ? "" : "border-b-2"
            } border-quaternary `}
          >
            <div className="w-[15%] text-start">
              <ExplorerLink
                path={`tx/${order.id}`}
                label={ellipsify(order.id)}
                className="font-normal text-xs underline"
              />
            </div>
            <div className="w-[15%] text-start">
              <ExplorerLink
                path={`address/${order.productId}`}
                label={ellipsify(order.productId)}
                className="font-normal text-xs underline"
              />
            </div>
            <div className="w-[15%] text-start">
              <ExplorerLink
                path={`address/${order.buyerId}`}
                label={ellipsify(order.buyerId)}
                className="font-normal text-xs underline"
              />
            </div>
            <div className="w-[5%] text-right">
              <p className="font-normal text-xs">{order.quantity}</p>
            </div>
            <div className="w-[15%] text-right">
              <p className="font-normal text-xs">{order.totalPrice} SOL</p>
            </div>
            <div className="w-[7%] text-left ml-[8%]">
              <p className="font-normal text-xs">{order.status}</p>
            </div>
            <div className="flex flex-row w-[15%] ml-[5%] justify-end">
              {order.status === "Confirmed" && (
                <button
                  className="btn btn-xs btn-mini w-[50%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
                  onClick={() => openFulfillModal(order)}
                  style={{ fontSize: "12px", border: "none" }}
                >
                  <IconPackageExport className="m-0 p-0" size={14} />
                  Fulfill
                </button>
              )}

              <button
                className="btn btn-xs btn-mini w-[50%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
                onClick={() => openCancelModal(order)}
                style={{ fontSize: "12px", border: "none" }}
              >
                <IconX className="m-0 p-0" size={14} />
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
      {showFulfillModal && selectedOrder && (
        <FulfillModal
          order={selectedOrder}
          onClose={closeFulfillModal}
          onFulfill={(fulfillmentProvider, trackingId, trackingLink) => {
            // useFulfillOrder.mutate(
            //   {
            //     orderId: selectedOrder.id,
            //     newStatus: "Fulfilled",
            //     // fulfillmentProvider,
            //     // trackingId,
            //     // trackingLink
            //   },
            //   {
            //     onSuccess: () => {
            //       toast.success("Order fulfilled successfully");
            //       closeFulfillModal();
            //     },
            //     onError: (error: { message: string }) => {
            //       toast.error(`Failed to fulfill order: ${error.message}`);
            //     },
            //   }
            // );
          }}
        />
      )}
      {showCancelModal && selectedOrder && (
        <CancelModal
          order={selectedOrder}
          onClose={closeCancelModal}
          onCancel={() => {
            // useCancelOrder.mutate(
            //   { orderId: selectedOrder.id, newStatus: "Cancelled" },
            //   {
            //     onSuccess: () => {
            //       toast.success("Order cancelled successfully");
            //       closeCancelModal();
            //     },
            //     onError: (error: { message: string }) => {
            //       toast.error(`Failed to cancel order: ${error.message}`);
            //     },
            //   }
            // );
          }}
        />
      )}
    </>
  );
}

function FulfillModal({
  order,
  onClose,
  onFulfill,
}: {
  order: Order;
  onClose: () => void;
  onFulfill: (
    fulfillmentProvider: string,
    trackingId: string,
    trackingLink: string
  ) => void;
}) {
  const [fulfillmentProvider, setFulfillmentProvider] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCopied) {
      timer = setTimeout(() => setIsCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [isCopied]);

  const copyShippingInfo = () => {
    const shippingInfo = `${order.shippingName}\n${order.shippingAddress}\n${order.shippingCity}, ${order.shippingStateProvince} ${order.shippingZipCode}\n${order.shippingCountryRegion}`;
    navigator.clipboard.writeText(shippingInfo).then(
      () => {
        setIsCopied(true);
        toast.success("Copied info to clipboard");
      },
      () => {
        toast.error("Failed to copy shipping info");
      }
    );
  };

  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start">Fulfill Order</h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              Order ID:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">{order.id}</p>
          </div>
        </div>

        <div className="bg-quaternary p-4 rounded w-full relative">
          <p className="text-white text-xs text-start font-bold pb-2 flex justify-between items-center">
            SHIPPING INFO:
            {isCopied ? (
              <IconCheck className="text-green" size={18} />
            ) : (
              <IconCopy
                className="cursor-pointer"
                size={18}
                onClick={copyShippingInfo}
              />
            )}
          </p>
          <p className="text-white text-xs text-start">
            {order.shippingName}
            <br />
            {order.shippingAddress}
            <br />
            {order.shippingCity}, {order.shippingStateProvince}{" "}
            {order.shippingZipCode}
            <br />
            {order.shippingCountryRegion}
          </p>
        </div>

        <select
          value={fulfillmentProvider}
          onChange={(e) => setFulfillmentProvider(e.target.value)}
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        >
          <option value="">Select a fulfillment provider</option>
          <option value="DHL">DHL</option>
          <option value="Fedex">Fedex</option>
          <option value="USPS">USPS</option>
          <option value="UPS">UPS</option>
          <option value="Amazon">Amazon</option>
          <option value="Flexport">Flexport</option>
        </select>

        <input
          type="text"
          placeholder="Tracking ID/Number"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        />

        <input
          type="text"
          placeholder="Tracking Link"
          value={trackingLink}
          onChange={(e) => setTrackingLink(e.target.value)}
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        />

        <div className="flex flex-row gap-[4%] py-2">
          <button
            className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`btn btn-xs lg:btn-sm w-[48%] py-3 ${
              !fulfillmentProvider || !trackingId || !trackingLink
                ? "btn-disabled"
                : "btn-primary"
            }`}
            onClick={() =>
              onFulfill(fulfillmentProvider, trackingId, trackingLink)
            }
            disabled={!fulfillmentProvider || !trackingId || !trackingLink}
          >
            Confirm Fulfillment
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelModal({
  order,
  onClose,
  onCancel,
}: {
  order: Order;
  onClose: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start">Cancel Order</h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              Order ID:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">{order.id}</p>
          </div>
        </div>
        <div className="bg-quaternary p-2 rounded w-full">
          <span className="text-red font-bold text-xs flex flex-row justify-center">
            WARNING:
            <p className="text-white font-semibold text-xs ml-2">
              THIS ACTION IS PERMANENT - PROCEED WITH CAUTION!!!
            </p>
          </span>
        </div>

        <div className="flex flex-row gap-[4%] py-2">
          <button
            className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
            onClick={onClose}
          >
            Exit
          </button>
          <button
            className="btn btn-xs lg:btn-sm btn-warning w-[48%] py-3"
            onClick={onCancel}
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
