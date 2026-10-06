import { useEffect, useState } from "react";
import axios from "axios";

function About() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        profile_image: "",
        resume_url: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/about"
            );

            if (response.data.data) {
                setForm({
                    title: response.data.data.title || "",
                    description: response.data.data.description || "",
                    profile_image:
                        response.data.data.profile_image || "",
                    resume_url:
                        response.data.data.resume_url || ""
                });
            }

        } catch (error) {
            console.error(error);
            setMessage("Failed to load About content");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const response = await axios.put(
                "http://localhost:5000/about",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                response.data.message ||
                "About content updated successfully"
            );

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to update About content"
            );

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <h2>Loading About content...</h2>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            <div style={styles.header}>
                <div>
                    <h1>About</h1>
                    <p style={styles.subtitle}>
                        Manage your portfolio introduction.
                    </p>
                </div>

                <button
                    onClick={() =>
                        window.location.href = "/dashboard"
                    }
                    style={styles.backButton}
                >
                    Back to Dashboard
                </button>
            </div>

            <div style={styles.card}>

                <form onSubmit={handleSubmit}>

                    <label style={styles.label}>
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter your title"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter your description"
                        rows="7"
                        style={styles.textarea}
                    />

                    <label style={styles.label}>
                        Profile Image URL
                    </label>

                    <input
                        type="text"
                        name="profile_image"
                        value={form.profile_image}
                        onChange={handleChange}
                        placeholder="Enter profile image URL"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Resume URL
                    </label>

                    <input
                        type="text"
                        name="resume_url"
                        value={form.resume_url}
                        onChange={handleChange}
                        placeholder="Enter resume URL"
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        style={styles.saveButton}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save About"}
                    </button>

                </form>

                {message && (
                    <p style={styles.message}>
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },

    subtitle: {
        color: "#666"
    },

    backButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        background: "#374151",
        color: "#ffffff",
        cursor: "pointer"
    },

    card: {
        maxWidth: "800px",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        marginTop: "20px",
        fontWeight: "bold"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px",
        resize: "vertical"
    },

    saveButton: {
        marginTop: "25px",
        padding: "13px 25px",
        border: "none",
        borderRadius: "6px",
        background: "#111827",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "15px"
    },

    message: {
        marginTop: "20px",
        fontWeight: "bold"
    }
};

export default About;