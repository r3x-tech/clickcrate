import React, { useState, ChangeEvent, FormEvent } from "react";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useCreateClickcrate } from "../hooks/useCreateClickcrate";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PlacementType,
  ProductCategory,
  OrderManager,
  CreateProductData,
  CreateClickcrateData,
} from "@/types";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import toast from "react-hot-toast";
import { uploadImageToStorage } from "@/services/solanaService";
import { IconTrash } from "@tabler/icons-react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [creationType, setCreationType] = useState<"product" | "clickcrate">(
    "product"
  );
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [formData, setFormData] = useState<
    Partial<CreateProductData> | Partial<CreateClickcrateData>
  >({});

  const [imageFile, setImageFile] = useState<File | null>(null);

  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const createProduct = useCreateProduct(publicKey?.toBase58() || null);
  const createClickcrate = useCreateClickcrate(publicKey?.toBase58() || null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return { [name]: value };
      if (name === "placementFee") {
        return {
          ...prev,
          [name]: value === "" ? undefined : parseFloat(value),
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCsvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUrlParse = () => {
    console.log("Parsing URL:", urlInput);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      [creationType === "product" ? "listingImage" : "image"]: "",
    }));
  };

  function isProductData(
    data: Partial<CreateProductData> | Partial<CreateClickcrateData>
  ): data is Partial<CreateProductData> {
    return "listingName" in data;
  }

  function isClickcrateData(
    data: Partial<CreateProductData> | Partial<CreateClickcrateData>
  ): data is Partial<CreateClickcrateData> {
    return "name" in data;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!wallet || !publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      let imageUri: string | undefined;

      if (imageFile) {
        imageUri = await uploadImageToStorage(imageFile);
      } else {
        if (isProductData(formData)) {
          imageUri = formData.listingImage;
        } else {
          imageUri = formData.image;
        }
      }

      if (!imageUri) {
        toast.error("Please provide an image");
        return;
      }

      const baseData = {
        creator: publicKey.toBase58(),
        feePayer: publicKey.toBase58(),
        creator_url: "https://www.clickcrate.xyz/",
      };

      if (isProductData(formData)) {
        // Generate symbol for product
        const symbol = generateSymbol(formData.listingName || "");

        const productData = {
          ...formData,
          ...baseData,
          listingImage: imageUri,
          symbol, // Include the symbol here
        };
        if (validateProductData(productData)) {
          await createProduct.mutateAsync(productData);
          toast.success("Product created successfully");
          onClose();
        }
      } else {
        // Generate symbol for clickcrate
        const symbol = generateSymbol(formData.name || "");

        const clickcrateData = {
          ...formData,
          ...baseData,
          image: imageUri,
          symbol, // Include the symbol here
        };
        if (validateClickcrateData(clickcrateData)) {
          await createClickcrate.mutateAsync(clickcrateData);
          toast.success("ClickCrate created successfully");
          onClose();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Failed to create ${isProductData(formData) ? "product" : "ClickCrate"}`
      );
    }
  };

  const handleCreationTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "product" | "clickcrate";
    setCreationType(newType);
    setFormData({});
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFormData((prev) => ({
        ...prev,
        [creationType === "product" ? "listingImage" : "image"]: "",
      }));
    }
  };

  const generateSymbol = (name: string) => {
    return name.slice(0, 5).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-6 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start tracking-wide">
            Create{" "}
            {creationType === "product" ? "Product Listing" : "ClickCrate"}
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
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
          value={creationType}
          onChange={handleCreationTypeChange}
        >
          <option value="product">Create Product Listing</option>
          <option value="clickcrate">Create ClickCrate</option>
        </select>

        <div className="flex items-center space-x-2 justify-between border-t-2 pt-6">
          <div className="flex flex-[0_0_35%] items-center justify-start">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              id="csvUpload"
            />
            <label
              htmlFor="csvUpload"
              className="btn btn-xs lg:btn-sm btn-outline w-full py-3"
            >
              Load from CSV
            </label>
          </div>

          <p className="flex-[0_0_5%] text-sm">OR</p>

          <div className="flex flex-[0_0_50%] items-center justify-end">
            <input
              type="text"
              placeholder="Load from URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="rounded-l-full p-2 text-white w-2/3 border-4 border-tertiary bg-tertiary text-sm"
            />
            <button
              onClick={handleUrlParse}
              className="btn btn-xs lg:btn-sm btn-primary-alt w-1/3 py-3"
            >
              Parse
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {creationType === "product" ? (
            <>
              <input
                type="text"
                name="listingName"
                placeholder="Product Name"
                onChange={handleInputChange}
                className="rounded-lg p-2 text-white w-full bg-tertiary  text-sm"
                required
              />
              <textarea
                name="listingDescription"
                placeholder="Product Description"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              />
              <div className="flex items-center space-x-4 flex-1 h-full">
                <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg overflow-hidden">
                  {imageFile ||
                  (formData as Partial<CreateProductData>).listingImage ? (
                    <img
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : (formData as Partial<CreateProductData>)
                              .listingImage
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm text-white font-bold mb-2">
                    PRODUCT IMAGE
                  </p>

                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 truncate">
                      {imageFile
                        ? imageFile.name
                        : (formData as Partial<CreateProductData>)
                            .listingImage || "No file selected"}
                    </p>
                    {(imageFile ||
                      (formData as Partial<CreateProductData>)
                        .listingImage) && (
                      <button
                        onClick={handleClearImage}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Clear image"
                      >
                        <IconTrash size={20} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-between mt-4">
                    <div className="flex flex-1 items-center justify-start w-full">
                      <input
                        type="file"
                        accept=".png,.svg"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="btn btn-xs lg:btn-sm btn-outline w-full py-3"
                      >
                        Upload Image
                      </label>
                    </div>
                    <p className="flex-none text-sm my-2">OR</p>
                    <div className="flex flex-1 items-center w-full justify-end">
                      <input
                        type="url"
                        name="listingImage"
                        placeholder="Enter Image URL"
                        onChange={handleInputChange}
                        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <select
                name="productCategory"
                value={(formData as CreateProductData)?.productCategory || ""}
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
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
              <select
                name="placementType"
                value={(formData as CreateProductData)?.placementType || ""}
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              >
                <option value="">Select a placement type</option>
                <option value="relatedpurchase">Related Purchase</option>
                <option value="digitalreplica">Digital Replica</option>
                <option value="targetedplacement">Targeted Placement</option>
              </select>
              <input
                type="text"
                name="additionalPlacementRequirements"
                placeholder="Additional Placement Requirements (optional)"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
              />
              <input
                type="text"
                name="discount"
                placeholder="Discount (optional)"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
              />
              <input
                type="url"
                name="customerProfileUri"
                placeholder="Customer Profile URI (optional)"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
              />
              <input
                type="text"
                name="sku"
                placeholder="SKU (optional)"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
              />
              <input
                type="url"
                name="external_url"
                placeholder="Creator Website"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="name"
                placeholder="Point of Sale Name"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              />
              <textarea
                name="description"
                placeholder="Point of Sale Description"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              />
              <div className="flex items-center space-x-4 flex-1 h-full">
                <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg overflow-hidden">
                  {imageFile ||
                  (formData as Partial<CreateClickcrateData>).image ? (
                    <img
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : (formData as Partial<CreateClickcrateData>).image
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm text-white font-bold mb-2">
                    CLICKCRATE IMAGE
                  </p>

                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 truncate">
                      {imageFile
                        ? imageFile.name
                        : (formData as Partial<CreateClickcrateData>).image ||
                          "No file selected"}
                    </p>
                    {(imageFile ||
                      (formData as Partial<CreateClickcrateData>).image) && (
                      <button
                        onClick={handleClearImage}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Clear image"
                      >
                        <IconTrash size={20} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-between mt-4">
                    <div className="flex flex-1 items-center justify-start w-full">
                      <input
                        type="file"
                        accept=".png,.svg"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="clickcrateImageUpload"
                      />
                      <label
                        htmlFor="clickcrateImageUpload"
                        className="btn btn-xs lg:btn-sm btn-outline w-full py-3"
                      >
                        Upload Image
                      </label>
                    </div>
                    <p className="flex-none text-sm my-2">OR</p>
                    <div className="flex flex-1 items-center w-full justify-end">
                      <input
                        type="url"
                        name="image"
                        placeholder="Enter Image URL"
                        onChange={handleInputChange}
                        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <select
                name="placementType"
                value={(formData as CreateClickcrateData)?.placementType || ""}
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              >
                <option value="">Select a placement type</option>
                <option value="relatedpurchase">Related Purchase</option>
                <option value="digitalreplica">Digital Replica</option>
                <option value="targetedplacement">Targeted Placement</option>
              </select>
              <input
                type="text"
                name="additionalPlacementRequirements"
                placeholder="Additional Placement Requirements (optional)"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
              />
              <input
                type="number"
                name="placementFee"
                placeholder="Placement Fee (in SOL)"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              />
              <input
                type="url"
                name="userProfileUri"
                placeholder="User Profile URI (optional)"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
              />
              <input
                type="url"
                name="external_url"
                placeholder="Creator Website"
                onChange={handleInputChange}
                className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
                required
              />
            </>
          )}
          <div className="flex flex-row gap-[4%] py-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
              disabled={createProduct.isPending || createClickcrate.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
              disabled={createProduct.isPending || createClickcrate.isPending}
            >
              {createProduct.isPending || createClickcrate.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function validateProductData(
  data: Partial<CreateProductData>
): data is CreateProductData {
  const requiredFields: (keyof CreateProductData)[] = [
    "listingName",
    "listingDescription",
    "productCategory",
    "placementType",
    "external_url",
  ];
  for (const field of requiredFields) {
    if (!data[field]) {
      toast.error(`Please fill in the ${field} field`);
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  return true;
}

function validateClickcrateData(
  data: Partial<CreateClickcrateData>
): data is CreateClickcrateData {
  const requiredFields: (keyof CreateClickcrateData)[] = [
    "name",
    "description",
    "placementType",
    "placementFee",
    "external_url",
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      toast.error(`Please fill in the ${field} field`);
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  if (typeof data.placementFee !== "number" || isNaN(data.placementFee)) {
    toast.error("Placement fee must be a valid number");
    return false;
  }
  return true;
}
