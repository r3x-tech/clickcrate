import React, { useState, ChangeEvent } from "react";
import { CreateProductData, ProductCategory, PlacementType } from "@/types";
import toast from "react-hot-toast";
import { ImageUploadMini } from "@/components/ImageUploadMini";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { uploadFile } from "@/services/uploadService";
import { generateSymbol } from "@/utils/conversions";

interface ProductFormProps {
  onClose: () => void;
  onCreationStart: () => void;
  onCreationSuccess: (id: string, productIds: string[]) => void;
  onCreationFailure: () => void;
  isCreating: boolean;
}

type ExtendedCreateProductData = CreateProductData & {
  productImage: string;
  brand: string;
  size: string;
};

export const ProductForm: React.FC<ProductFormProps> = ({
  onClose,
  onCreationStart,
  onCreationSuccess,
  onCreationFailure,
  isCreating,
}) => {
  const [formData, setFormData] = useState<Partial<ExtendedCreateProductData>>(
    {}
  );
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [listingImageFile, setListingImageFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [numProducts, setNumProducts] = useState<string>(
    "# of Products (1-10)"
  );

  const wallet = useWallet();
  const { createProduct } = useCreateProduct();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumProductsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 10)) {
      setNumProducts(value);
    }
  };

  const handleCsvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
      console.log("CSV file selected:", e.target.files[0].name);
    }
  };

  const handleUrlParse = () => {
    console.log("Parsing URL:", urlInput);
  };

  const generateProductMetadata = (
    baseData: Partial<ExtendedCreateProductData>,
    index: number
  ) => {
    return {
      name: `${baseData.listingName} #${index + 1}`,
      symbol: generateSymbol(`${baseData.listingName} #${index + 1}`),
      description: baseData.listingDescription || "",
      image: baseData.productImage || "",
      external_url: baseData.external_url || "https://www.clickcrate.xyz/",
      creator_url: "https://www.clickcrate.xyz/",
      brand: baseData.brand || "",
      size: baseData.size || "",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!formData.listingImage || !formData.productImage) {
      toast.error("Please provide both listing and product images");
      return;
    }

    if (validateProductData(formData)) {
      onCreationStart();
      try {
        let listingImageUri = formData.listingImage;
        let productImageUri = formData.productImage;

        if (listingImageFile) {
          try {
            listingImageUri = await uploadFile(
              listingImageFile,
              wallet,
              "mainnet"
            );
          } catch (uploadError) {
            throw Error(
              `Listing image upload failed: ${
                uploadError instanceof Error
                  ? uploadError.message
                  : "Unknown error"
              }`
            );
          }
        }

        if (productImageFile) {
          try {
            productImageUri = await uploadFile(
              productImageFile,
              wallet,
              "mainnet"
            );
          } catch (uploadError) {
            throw Error(
              `Product image upload failed: ${
                uploadError instanceof Error
                  ? uploadError.message
                  : "Unknown error"
              }`
            );
          }
        }

        const numProductsValue = parseInt(numProducts) || 1;
        const products = Array.from({ length: numProductsValue }, (_, i) =>
          generateProductMetadata(
            { ...formData, productImage: productImageUri },
            i
          )
        );

        const productListingData: CreateProductData = {
          listingName: formData.listingName || "",
          listingSymbol: generateSymbol(formData.listingName || ""),
          listingDescription: formData.listingDescription || "",
          listingImage: listingImageUri,
          productCategory: formData.productCategory,
          placementType: formData.placementType,
          additionalPlacementRequirements:
            formData.additionalPlacementRequirements || "None",
          discount: formData.discount || "None",
          customerProfileUri:
            formData.customerProfileUri || "https://www.clickcrate.xyz/",
          sku: formData.sku || "None",
          products: products.map((product) => ({
            name: product.name,
            symbol: product.symbol,
            description: product.description,
            image: product.image,
            external_url: product.external_url,
            creator_url: product.creator_url,
            brand: product.brand,
            size: product.size,
          })),
          creator: wallet.publicKey.toBase58(),
          feePayer: wallet.publicKey.toBase58(),
          external_url: formData.external_url || "https://www.clickcrate.xyz/",
          creator_url: "https://www.clickcrate.xyz/",
        };

        console.log("productData is: ", productListingData);

        const result = await createProduct(productListingData);
        console.log("result.message: ", result.message);
        console.log("Tx Signatures: ", result.signatures);
        console.log("listing id: ", result.listingId);

        toast.success("Product created ");
        onCreationSuccess(result.listingId, result.productIds || []);
      } catch (error) {
        console.error("Error creating product:", error);
        toast.error(
          `Failed to create product: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        onCreationFailure();
      }
    }
  };

  if (isCreating) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-full">
        <div className="loading loading-spinner loading-sm"></div>
        <p className="text-sm font-bold">CREATING</p>
        <p className="text-xs font-semibold text-red my-4 p-2 bg-tertiary text-center rounded-md">
          WARNING: CLOSING THIS WINDOW MAY RESULT IN A FAILED CREATION
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            type="button"
          >
            Parse
          </button>
        </div>
      </div>

      <p className="text-start font-semibold tracking-wide text-xs pt-4">
        PRODUCT LISTING INFORMATION
      </p>
      <input
        type="number"
        name="numProducts"
        placeholder="# of Products (1-10)"
        value={numProducts}
        onChange={handleNumProductsChange}
        onBlur={() => {
          const num = parseInt(numProducts);
          if (isNaN(num) || num < 1) {
            setNumProducts("1");
          } else if (num > 10) {
            setNumProducts("10");
          }
        }}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        min="1"
        max="10"
      />
      <div>
        <ImageUploadMini
          onImageChange={(image, file) => {
            setFormData((prev) => ({ ...prev, listingImage: image }));
            setListingImageFile(file);
          }}
          initialImage={formData.listingImage}
          imageType="Listing"
          identifier="listing-image"
        />
      </div>
      <input
        type="text"
        name="listingName"
        placeholder="Product Name"
        value={formData.listingName || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
      />
      <textarea
        name="listingDescription"
        placeholder="Product Description"
        value={formData.listingDescription || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
      />

      <div>
        <ImageUploadMini
          onImageChange={(image, file) => {
            setFormData((prev) => ({ ...prev, productImage: image }));
            setProductImageFile(file);
          }}
          initialImage={formData.productImage}
          imageType="Product"
          identifier="product-image"
        />
      </div>

      <select
        name="productCategory"
        value={formData.productCategory || ""}
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
        value={formData.placementType || ""}
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
        name="size"
        placeholder="Size"
        value={formData.size || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
      />
      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={formData.brand || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
      />
      <input
        type="url"
        name="external_url"
        placeholder="Creator Website"
        value={formData.external_url || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
      />
      <input
        type="text"
        name="sku"
        placeholder="Product SKU (optional)"
        value={formData.sku || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
      />
      <input
        type="text"
        name="discount"
        placeholder="Discount (optional)"
        value={formData.discount || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
      />
      <input
        type="text"
        name="additionalPlacementRequirements"
        placeholder="Additional Placement Requirements (optional)"
        value={formData.additionalPlacementRequirements || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
      />
      <input
        type="url"
        name="customerProfileUri"
        placeholder="Customer Profile URI (optional)"
        value={formData.customerProfileUri || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
      />

      <div className="flex flex-row gap-[4%] py-2">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
        >
          Create
        </button>
      </div>
    </form>
  );
};

function validateProductData(
  data: Partial<ExtendedCreateProductData>
): data is ExtendedCreateProductData {
  const requiredFields: (keyof ExtendedCreateProductData)[] = [
    "listingName",
    "listingDescription",
    "listingImage",
    "productImage",
    "productCategory",
    "placementType",
    "external_url",
    "brand",
    "size",
  ];
  for (const field of requiredFields) {
    if (!data[field]) {
      toast.error(`Please fill in the ${field} field`);
      return false;
    }
  }
  return true;
}
