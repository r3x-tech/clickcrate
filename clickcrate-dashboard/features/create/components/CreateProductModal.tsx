import React, { ChangeEvent, FormEvent, useState } from "react";
import { useCreateProduct } from "../hooks/useCreateProduct";
import toast from "react-hot-toast";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import { useWallet } from "@solana/wallet-adapter-react";
import { ProductCreationData } from "@/types";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { publicKey } = useWallet();
  const [productType, setProductType] = useState<
    "custom" | "template" | "csv" | "url"
  >("custom");
  const [formData, setFormData] = useState<ProductCreationData>({
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    currency: "SOL",
    orderManager: "clickcrate",
    email: "",
    placementType: "relatedpurchase",
    productCategory: "clothing",
  });

  const createProductMutation = useCreateProduct(
    publicKey ? publicKey.toBase58() : null
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createProductMutation.mutateAsync(formData);
      toast.success("Product created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start tracking-wide">
            Create New Product
          </h1>
          {publicKey && (
            <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
              <p className="text-start font-semibold tracking-wide text-xs">
                Owner:{" "}
              </p>
              <p className="pl-2 text-start font-normal text-xs">
                <ExplorerLink
                  path={`account/${publicKey}`}
                  label={ellipsify(publicKey.toString())}
                />
              </p>
            </div>
          )}
        </div>

        <select
          className="rounded-lg p-2 text-black w-full"
          value={productType}
          onChange={(e) =>
            setProductType(
              e.target.value as "custom" | "template" | "csv" | "url"
            )
          }
        >
          <option value="custom">Custom Product</option>
          <option value="template">Template</option>
          <option value="csv">CSV</option>
          <option value="url">URL</option>
        </select>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="rounded-lg p-2 text-black w-full"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="rounded-lg p-2 text-black w-full"
            required
          />

          <div className="flex space-x-4">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              min="1"
              max="10"
              className="rounded-lg p-2 text-black w-1/2"
              required
            />

            <div className="flex w-1/2">
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="Unit Price"
                step="0.000000001"
                min="0"
                className="rounded-lg p-2 text-black w-2/3"
                required
              />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="rounded-lg p-2 text-black w-1/3"
              >
                <option value="SOL">SOL</option>
                <option value="USDC" disabled>
                  USDC
                </option>
              </select>
            </div>
          </div>

          <select
            name="orderManager"
            value={formData.orderManager}
            onChange={handleInputChange}
            className="rounded-lg p-2 text-black w-full"
          >
            <option value="">Select an order manager</option>
            <option value="clickcrate">ClickCrate</option>
            <option value="shopify">Shopify</option>
            <option value="square">Square</option>
          </select>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="rounded-lg p-2 text-black w-full"
            required
          />

          <select
            name="placementType"
            value={formData.placementType}
            onChange={handleInputChange}
            className="rounded-lg p-2 text-black w-full"
          >
            <option value="">Select a placement type</option>
            <option value="relatedpurchase">Related Purchase</option>
            <option value="digitalreplica">Digital Replica</option>
            <option value="targetedplacement">Targeted Placement</option>
          </select>

          <select
            name="productCategory"
            value={formData.productCategory}
            onChange={handleInputChange}
            className="rounded-lg p-2 text-black w-full"
          >
            <option value="">Select a product category</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="home">Home</option>
            <option value="beauty">Beauty</option>
            <option value="toys">Toys</option>
            <option value="sports">Sports</option>
            <option value="automotive">Automotive</option>
            <option value="grocery">Grocery</option>
            <option value="health">Health</option>
          </select>

          <div className="flex flex-row gap-[4%] py-2">
            <button
              type="button"
              className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>

        {createProductMutation.isPending && (
          <div className="flex flex-col items-center justify-center w-[100%] p-6 space-y-2">
            <span className="loading loading-spinner loading-md"></span>
            <p className="font-body text-sm font-normal">LOADING</p>
          </div>
        )}
      </div>
    </div>
  );
};
