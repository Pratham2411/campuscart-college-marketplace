export const buildProductFormData = (payload) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("price", payload.price);
  formData.append("category", payload.category);
  formData.append("condition", payload.condition);
  formData.append("campusLocation", payload.campusLocation);
  formData.append("tags", payload.tags || "");
  formData.append(
    "imageUrls",
    JSON.stringify(
      payload.imageUrls
        .split("\n")
        .flatMap((entry) => entry.split(","))
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  );
  formData.append(
    "existingImages",
    JSON.stringify(payload.existingImages || [])
  );

  (payload.selectedFiles || []).forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};
