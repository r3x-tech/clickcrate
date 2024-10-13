import React, { useState, ChangeEvent } from "react";
import { CreateClickcrateData, PlacementType } from "@/types";
import toast from "react-hot-toast";
import { ImageUploadMini } from "@/components/ImageUploadMini";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCreateClickcrate } from "../../hooks/useCreateClickcrate";
import { uploadFile } from "@/services/uploadService";
import { generateSymbol } from "@/utils/conversions";

interface ClickcrateFormProps {
  onClose: () => void;
  onCreationStart: () => void;
  onCreationSuccess: (id: string) => void;
  onCreationFailure: () => void;
  isCreating: boolean;
}

export const ClickcrateForm: React.FC<ClickcrateFormProps> = ({
  onClose,
  onCreationStart,
  onCreationSuccess,
  onCreationFailure,
  isCreating,
}) => {
  const [formData, setFormData] = useState<Partial<CreateClickcrateData>>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const wallet = useWallet();
  const { createClickcrate } = useCreateClickcrate();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === "placementFee") {
      parsedValue = value === "" ? "" : parseFloat(value);
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleCsvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
      // TODO: Implement CSV parsing logic
      console.log("CSV file selected:", e.target.files[0].name);
    }
  };

  const handleUrlParse = () => {
    // TODO: Implement URL parsing logic
    console.log("Parsing URL:", urlInput);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!formData.image) {
      toast.error("Please provide an image");
      return;
    }

    if (validateClickcrateData(formData)) {
      onCreationStart();
      try {
        let imageUri = formData.image;

        if (imageFile) {
          try {
            imageUri = await uploadFile(imageFile, wallet, "mainnet");
          } catch (uploadError) {
            if (uploadError instanceof Error) {
              throw Error(`Image upload failed: ${uploadError.message}`);
            } else {
              throw Error("Image upload failed due to an unknown error");
            }
          }
        }

        const clickcrateData: CreateClickcrateData = {
          ...formData,
          creator: wallet.publicKey.toBase58(),
          feePayer: wallet.publicKey.toBase58(),
          creator_url: "https://www.clickcrate.xyz/",
          external_url: formData.external_url || "https://www.clickcrate.xyz/",
          symbol: generateSymbol(formData.name),
          image: imageUri,
        } as CreateClickcrateData;
        console.log("clickcrateData is: ", clickcrateData);

        const result = await createClickcrate(clickcrateData);
        console.log("result.message: ", result.message);
        console.log("Tx Sig: ", result.signature);
        console.log("clickcrate id: ", result.clickcrateId);

        toast.success("ClickCrate created successfully");
        onCreationSuccess(result.clickcrateId);
      } catch (error) {
        console.error("Error creating ClickCrate:", error);
        if (error instanceof Error) {
          toast.error(`Failed to create ClickCrate: ${error.message}`);
        } else {
          toast.error("Failed to create ClickCrate due to an unknown error");
        }
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
        CLICKCRATE INFORMATION{" "}
      </p>
      <input
        type="text"
        name="name"
        placeholder="Point of Sale Name"
        value={formData.name || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
      />
      <textarea
        name="description"
        placeholder="Point of Sale Description"
        value={formData.description || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
      />
      <ImageUploadMini
        onImageChange={(image, file) => {
          setFormData((prev) => ({ ...prev, image }));
          setImageFile(file);
        }}
        initialImage={formData.image}
        identifier="clickcrate-image"
      />
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
        type="number"
        name="placementFee"
        placeholder="Placement Fee (in SOL)"
        value={formData.placementFee ?? ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        required
        min="0"
        step="any"
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
        name="additionalPlacementRequirements"
        placeholder="Additional Placement Requirements (optional)"
        value={formData.additionalPlacementRequirements || ""}
        onChange={handleInputChange}
        className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
      />
      <input
        type="url"
        name="userProfileUri"
        placeholder="User Profile URI (optional)"
        value={formData.userProfileUri || ""}
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

function validateClickcrateData(
  data: Partial<CreateClickcrateData>
): data is CreateClickcrateData {
  const requiredFields: (keyof CreateClickcrateData)[] = [
    "name",
    "description",
    "image",
    "placementType",
    "placementFee",
    "external_url",
  ];
  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      toast.error(`Please fill in the ${field} field`);
      return false;
    }
  }
  if (
    typeof data.placementFee !== "number" ||
    isNaN(data.placementFee) ||
    data.placementFee < 0
  ) {
    toast.error(
      "Placement fee must be a valid number greater than or equal to 0"
    );
    return false;
  }
  return true;
}
