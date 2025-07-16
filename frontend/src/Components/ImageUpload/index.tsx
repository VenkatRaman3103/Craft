import { uploadImage } from "@/api/mediaBuckets/uploads/uploadImage";
import { useState } from "react";
import "./index.scss";

const ImageUpload = ({ mediaBucketId = null, onUploadSuccess }: any) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setError(null);

        if (!selectedFile.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (selectedFile.size > maxSize) {
            setError("File size must be less than 5MB");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const response = await uploadImage(file, mediaBucketId);
            console.log("Image uploaded:", response);

            if (onUploadSuccess) {
                onUploadSuccess(response);
            }

            setFile(null);
            setPreview(null);

            if (preview) {
                URL.revokeObjectURL(preview);
            }
        } catch (error) {
            console.error("Upload failed:", error);

            let errorMessage = "Upload failed. Please try again.";

            if (error.response) {
                errorMessage = `Upload failed: ${error.response.status} ${error.response.statusText}`;
                if (error.response.data?.message) {
                    errorMessage += ` - ${error.response.data.message}`;
                }
            } else if (error.request) {
                errorMessage =
                    "Cannot connect to server. Please check if the backend is running.";
            } else {
                errorMessage = error.message || errorMessage;
            }

            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setFile(null);
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
        setError(null);
    };

    return (
        <div className="image-upload">
            <h3>Upload Image - {mediaBucketId}</h3>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="file-input"
            />

            {error && <div className="error-message">{error}</div>}

            {preview && (
                <div className="preview-container">
                    <img
                        src={preview}
                        alt="Preview"
                        className="preview-image"
                    />
                    <div className="file-info">
                        {file?.name} ({Math.round(file?.size / 1024)}KB)
                    </div>
                </div>
            )}

            {file && (
                <div className="button-container">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`btn btn-primary ${uploading ? "disabled" : ""}`}
                    >
                        {uploading ? "Uploading..." : "Save"}
                    </button>

                    <button
                        onClick={handleCancel}
                        disabled={uploading}
                        className={`btn btn-secondary ${uploading ? "disabled" : ""}`}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
