import React, { useState } from "react";
import {
  useCreateProduct,
  ProductCreationData,
} from "../hooks/useCreateProduct";
import toast from "react-hot-toast";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
}) => {
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

  const createProductMutation = useCreateProduct();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="modal modal-open">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw] max-w-3xl">
        <h2 className="text-lg font-bold">Create New Product</h2>

        <select
          className="select select-bordered w-full"
          value={productType}
          onChange={(e) =>
            setProductType(
              e.target.value as "custom" | "template" | "csv" | "url"
            )
          }
        >
          <option value="custom">Custom Product</option>
          {/* Add other options in the future */}
        </select>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="input input-bordered w-full"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="textarea textarea-bordered w-full rounded-2xl"
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
              className="input input-bordered w-1/2"
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
                className="input input-bordered w-2/3"
                required
              />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="select select-bordered w-1/3"
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
            className="select select-bordered w-full"
          >
            <option value="ClickCrate">ClickCrate</option>
            <option value="Shopify">Shopify</option>
            <option value="Square">Square</option>
          </select>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />

          <select
            name="placementType"
            value={formData.placementType}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="Relatedpurchase">Related Purchase</option>
            <option value="Digitalreplica">Digital Replica</option>
            <option value="Targetedplacement">Targeted Placement</option>
          </select>

          <select
            name="productCategory"
            value={formData.productCategory}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
            <option value="Beauty">Beauty</option>
            <option value="Toys">Toys</option>
            <option value="Sports">Sports</option>
            <option value="Automotive">Automotive</option>
            <option value="Grocery">Grocery</option>
            <option value="Health">Health</option>
          </select>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-xs lg:btn-sm btn-outline py-2 min-w-[8rem]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-xs lg:btn-sm btn-primary py-2 min-w-[8rem]"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  LOADING
                </>
              ) : (
                "Create"
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
