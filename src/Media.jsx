import { useEffect, useState } from "react";
import axios from "axios";

function Media() {
    const [media, setMedia] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("token");

    const fetchMedia = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/media",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMedia(response.data);

        } catch (error) {
            console.error("MEDIA ERROR:", error);

            const status = error.response?.status;
            const message = error.response?.data?.message;

            alert(
                `Failed to load media.\n\nStatus: ${
                    status || "No response"
                }\nMessage: ${
                    message || error.message
                }`
            );
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            e.target.value = "";
            setSelectedFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5 MB.");
            e.target.value = "";
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();

        formData.append("image", selectedFile);

        try {
            setUploading(true);

            await axios.post(
                "http://localhost:5000/upload/image",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Image uploaded successfully.");

            setSelectedFile(null);

            const input =
                document.getElementById(
                    "media-file-input"
                );

            if (input) {
                input.value = "";
            }

            fetchMedia();

        } catch (error) {
            console.error("UPLOAD ERROR:", error);

            alert(
                `Image upload failed.\n\nStatus: ${
                    error.response?.status ||
                    "No response"
                }\nMessage: ${
                    error.response?.data?.message ||
                    error.message
                }`
            );

        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/media/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Media deleted successfully.");

            fetchMedia();

        } catch (error) {
            console.error("DELETE MEDIA ERROR:", error);

            alert(
                `Failed to delete media.\n\nStatus: ${
                    error.response?.status ||
                    "No response"
                }\nMessage: ${
                    error.response?.data?.message ||
                    error.message
                }`
            );
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "40px"
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "30px"
                    }}
                >
                    <h1>Media Management</h1>

                    <button
                        onClick={() => {
                            window.location.href =
                                "/dashboard";
                        }}
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#222",
                            color: "white",
                            cursor: "pointer"
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        marginBottom: "30px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>Upload Image</h2>

                    <p
                        style={{
                            color: "#666",
                            marginBottom: "20px"
                        }}
                    >
                        Supported formats: JPG, PNG, WEBP
                        and GIF. Maximum size: 5 MB.
                    </p>

                    <form onSubmit={handleUpload}>
                        <input
                            id="media-file-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleFileChange}
                            style={{
                                marginBottom: "15px",
                                display: "block"
                            }}
                        />

                        {selectedFile && (
                            <p>
                                Selected:{" "}
                                <strong>
                                    {selectedFile.name}
                                </strong>
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={uploading}
                            style={{
                                padding: "12px 22px",
                                border: "none",
                                borderRadius: "6px",
                                background: uploading
                                    ? "#999"
                                    : "#2563eb",
                                color: "white",
                                cursor: uploading
                                    ? "not-allowed"
                                    : "pointer"
                            }}
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Image"}
                        </button>
                    </form>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>Media Library</h2>

                    {media.length === 0 ? (
                        <p>No media found yet.</p>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(220px, 1fr))",
                                gap: "20px",
                                marginTop: "20px"
                            }}
                        >
                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        border:
                                            "1px solid #ddd",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        background: "#fff"
                                    }}
                                >
                                    <img
                                        src={`http://localhost:5000${item.file_path}`}
                                        alt={
                                            item.original_name ||
                                            item.filename
                                        }
                                        style={{
                                            width: "100%",
                                            height: "180px",
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />

                                    <div
                                        style={{
                                            padding: "15px"
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontWeight:
                                                    "bold",
                                                wordBreak:
                                                    "break-word"
                                            }}
                                        >
                                            {item.original_name ||
                                                item.filename}
                                        </p>

                                        <p
                                            style={{
                                                fontSize:
                                                    "13px",
                                                color:
                                                    "#666"
                                            }}
                                        >
                                            {item.file_type}
                                        </p>

                                        <p
                                            style={{
                                                fontSize:
                                                    "13px",
                                                color:
                                                    "#666"
                                            }}
                                        >
                                            {item.file_size
                                                ? `${(
                                                      item.file_size /
                                                      1024
                                                  ).toFixed(
                                                      1
                                                  )} KB`
                                                : ""}
                                        </p>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    item.id
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "8px 15px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "5px",
                                                background:
                                                    "#dc2626",
                                                color:
                                                    "white",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Media;