import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductForm from "../components/ProductForm.jsx";
import Alert from "../components/ui/Alert.jsx";
import Loader from "../components/ui/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { buildProductFormData } from "../utils/buildProductFormData.js";
import { getApiErrorMessage } from "../utils/formatters.js";

export default function EditListingPage() {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);

        if (data.product.seller._id !== user._id && user.role !== "admin") {
          navigate("/");
          return;
        }

        setProduct(data.product);
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, "Unable to load this listing."));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [navigate, productId, user]);

  const handleSave = async (payload) => {
    setSaving(true);
    setError("");

    try {
      const formData = buildProductFormData(payload);
      await api.patch(`/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate(`/products/${productId}`);
    } catch (saveError) {
      const message = getApiErrorMessage(saveError, "Unable to update listing.");
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading listing editor..." />;
  }

  return (
    <div className="space-y-5">
      {error ? <Alert>{error}</Alert> : null}
      {product ? (
        <ProductForm
          initialValues={product}
          loading={saving}
          onSubmit={handleSave}
          submitLabel="Save Changes"
        />
      ) : null}
    </div>
  );
}
