import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, CONDITIONS } from "../utils/constants.js";
import { getImageSrc } from "../utils/formatters.js";
import Alert from "./ui/Alert.jsx";

const defaultValues = {
  title: "",
  description: "",
  price: "",
  category: CATEGORIES[0],
  condition: "Good",
  campusLocation: "Main Campus",
  tags: "",
  imageUrls: "",
  existingImages: []
};

export default function ProductForm({
  initialValues = defaultValues,
  onSubmit,
  loading,
  submitLabel
}) {
  const [formValues, setFormValues] = useState(defaultValues);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormValues({
      title: initialValues.title || "",
      description: initialValues.description || "",
      price: initialValues.price || "",
      category: initialValues.category || CATEGORIES[0],
      condition: initialValues.condition || "Good",
      campusLocation: initialValues.campusLocation || "Main Campus",
      tags: Array.isArray(initialValues.tags)
        ? initialValues.tags.join(", ")
        : initialValues.tags || "",
      imageUrls: "",
      existingImages: initialValues.images || []
    });
  }, [initialValues]);

  const previews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file)
      })),
    [selectedFiles]
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews]
  );

  const handleChange = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formValues.title || !formValues.description || !formValues.price) {
      setError("Please complete the required fields before submitting.");
      return;
    }

    if (!formValues.existingImages.length && !selectedFiles.length && !formValues.imageUrls.trim()) {
      setError("Add at least one image file or a hosted image URL.");
      return;
    }

    try {
      await onSubmit({
        ...formValues,
        selectedFiles
      });
    } catch (submissionError) {
      setError(submissionError.message || "Unable to save listing.");
    }
  };

  return (
    <form className="surface-card space-y-6 p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pill">Seller Workspace</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Create a standout campus listing</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Share enough detail that another student can trust the listing immediately.
          </p>
        </div>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="label-text" htmlFor="title">
            Listing Title
          </label>
          <input
            className="input-field"
            id="title"
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="MacBook Air M1, 8GB / 256GB"
            value={formValues.title}
          />
        </div>

        <div>
          <label className="label-text" htmlFor="price">
            Price
          </label>
          <input
            className="input-field"
            id="price"
            min="0"
            onChange={(event) => handleChange("price", event.target.value)}
            placeholder="25000"
            type="number"
            value={formValues.price}
          />
        </div>

        <div>
          <label className="label-text" htmlFor="category">
            Category
          </label>
          <select
            className="input-field"
            id="category"
            onChange={(event) => handleChange("category", event.target.value)}
            value={formValues.category}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text" htmlFor="condition">
            Condition
          </label>
          <select
            className="input-field"
            id="condition"
            onChange={(event) => handleChange("condition", event.target.value)}
            value={formValues.condition}
          >
            {CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="label-text" htmlFor="description">
            Description
          </label>
          <textarea
            className="input-field min-h-36"
            id="description"
            onChange={(event) => handleChange("description", event.target.value)}
            placeholder="Mention usage, age, pickup details, defects, and why you're selling it."
            value={formValues.description}
          />
        </div>

        <div>
          <label className="label-text" htmlFor="campusLocation">
            Campus Location
          </label>
          <input
            className="input-field"
            id="campusLocation"
            onChange={(event) => handleChange("campusLocation", event.target.value)}
            placeholder="North Hostel Gate"
            value={formValues.campusLocation}
          />
        </div>

        <div>
          <label className="label-text" htmlFor="tags">
            Tags
          </label>
          <input
            className="input-field"
            id="tags"
            onChange={(event) => handleChange("tags", event.target.value)}
            placeholder="laptop, coding, lightweight"
            value={formValues.tags}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="label-text" htmlFor="images">
            Upload Images
          </label>
          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <ImagePlus className="mb-3 text-accent" size={28} />
            <span className="text-sm font-semibold text-slate-700">
              Choose up to 6 product images
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Cloudinary uploads will be used when credentials are configured.
            </span>
            <input
              className="hidden"
              id="images"
              multiple
              onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
              type="file"
            />
          </label>
        </div>

        <div>
          <label className="label-text" htmlFor="imageUrls">
            Hosted Image URLs
          </label>
          <textarea
            className="input-field min-h-44"
            id="imageUrls"
            onChange={(event) => handleChange("imageUrls", event.target.value)}
            placeholder="Optional fallback: paste one image URL per line or comma-separated."
            value={formValues.imageUrls}
          />
        </div>
      </div>

      {(formValues.existingImages.length > 0 || previews.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-ink">Image Preview</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {formValues.existingImages.map((image, index) => (
              <div className="relative overflow-hidden rounded-3xl" key={`${image.url}-${index + 1}`}>
                <img alt="Existing upload" className="h-40 w-full object-cover" src={getImageSrc(image)} />
                <button
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-700 shadow"
                  onClick={() =>
                    handleChange(
                      "existingImages",
                      formValues.existingImages.filter((_, imageIndex) => imageIndex !== index)
                    )
                  }
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {previews.map((preview) => (
              <div className="overflow-hidden rounded-3xl" key={preview.name}>
                <img alt={preview.name} className="h-40 w-full object-cover" src={preview.url} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
