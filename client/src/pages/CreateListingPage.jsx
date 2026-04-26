import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import ProductForm from "../components/ProductForm.jsx";
import Alert from "../components/ui/Alert.jsx";
import { buildProductFormData } from "../utils/buildProductFormData.js";
import { getApiErrorMessage } from "../utils/formatters.js";

export default function CreateListingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateListing = async (payload) => {
    setLoading(true);
    setError("");

    try {
      const formData = buildProductFormData(payload);
      const { data } = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate(`/products/${data.product._id}`);
    } catch (createError) {
      const message = getApiErrorMessage(createError, "Unable to create listing.");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {error ? <Alert>{error}</Alert> : null}
      <ProductForm loading={loading} onSubmit={handleCreateListing} submitLabel="Publish Listing" />
    </div>
  );
}
