import { useEffect, useState } from "react";
import axios from "axios";

function Blogs() {
    const [blogs, setBlogs] = useState([]);

    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_image: "",
        author: "",
        published: false
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_URL = "http://localhost:5000/blogs";

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(API_URL);

            setBlogs(response.data);
        } catch (error) {
            console.error("BLOGS FETCH ERROR:", error);

            setMessage("Failed to load blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const resetForm = () => {
        setForm({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            cover_image: "",
            author: "",
            published: false
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setMessage("You are not logged in.");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const data = {
                title: form.title,
                slug: form.slug,
                excerpt: form.excerpt,
                content: form.content,
                cover_image: form.cover_image,
                author: form.author,
                published: form.published
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/${editingId}`,
                    data,
                    config
                );

                setMessage("Blog updated successfully");
            } else {
                await axios.post(
                    API_URL,
                    data,
                    config
                );

                setMessage("Blog added successfully");
            }

            resetForm();
            await fetchBlogs();

        } catch (error) {
            console.error("BLOG SAVE ERROR:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to save blog"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (blog) => {
        setForm({
            title: blog.title || "",
            slug: blog.slug || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            cover_image: blog.cover_image || "",
            author: blog.author || "",
            published: blog.published || false
        });

        setEditingId(blog.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this blog?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Blog deleted successfully");

            await fetchBlogs();

        } catch (error) {
            console.error("BLOG DELETE ERROR:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to delete blog"
            );
        }
    };

    const goToDashboard = () => {
        window.location.href = "/dashboard";
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading Blogs...
            </div>
        );
    }

    return (
        <div style={styles.page}>

            <div style={styles.header}>

                <div>
                    <h1 style={styles.heading}>
                        Blogs
                    </h1>

                    <p style={styles.subtitle}>
                        Create and manage your blog posts.
                    </p>
                </div>

                <button
                    onClick={goToDashboard}
                    style={styles.backButton}
                >
                    Back to Dashboard
                </button>

            </div>

            <div style={styles.formCard}>

                <h2>
                    {editingId ? "Edit Blog" : "Add Blog"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label style={styles.label}>
                        Blog Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter blog title"
                        style={styles.input}
                        required
                    />

                    <label style={styles.label}>
                        Slug
                    </label>

                    <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        placeholder="Example: my-first-blog"
                        style={styles.input}
                        required
                    />

                    <label style={styles.label}>
                        Excerpt
                    </label>

                    <textarea
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        placeholder="Short description of the blog"
                        rows="4"
                        style={styles.textarea}
                    />

                    <label style={styles.label}>
                        Content
                    </label>

                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Write your blog content here..."
                        rows="10"
                        style={styles.textarea}
                        required
                    />

                    <label style={styles.label}>
                        Cover Image URL
                    </label>

                    <input
                        type="text"
                        name="cover_image"
                        value={form.cover_image}
                        onChange={handleChange}
                        placeholder="Enter cover image URL"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Author
                    </label>

                    <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Enter author name"
                        style={styles.input}
                    />

                    <label style={styles.checkboxLabel}>

                        <input
                            type="checkbox"
                            name="published"
                            checked={form.published}
                            onChange={handleChange}
                        />

                        <span>
                            Published
                        </span>

                    </label>

                    <div style={styles.buttonRow}>

                        <button
                            type="submit"
                            style={styles.saveButton}
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Blog"
                                    : "Add Blog"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

                {message && (
                    <div style={styles.message}>
                        {message}
                    </div>
                )}

            </div>

            <div style={styles.listCard}>

                <h2>
                    Your Blogs
                </h2>

                {blogs.length === 0 ? (

                    <p style={styles.empty}>
                        No blogs added yet.
                    </p>

                ) : (

                    <div style={styles.blogList}>

                        {blogs.map((blog) => (

                            <div
                                key={blog.id}
                                style={styles.blogItem}
                            >

                                {blog.cover_image && (
                                    <img
                                        src={blog.cover_image}
                                        alt={blog.title}
                                        style={styles.coverImage}
                                    />
                                )}

                                <div style={styles.blogContent}>

                                    <h3 style={styles.blogTitle}>
                                        {blog.title}
                                    </h3>

                                    <p style={styles.slug}>
                                        /{blog.slug}
                                    </p>

                                    <p style={styles.excerpt}>
                                        {blog.excerpt ||
                                            "No excerpt"}
                                    </p>

                                    <p style={styles.author}>
                                        Author:{" "}
                                        {blog.author ||
                                            "Not specified"}
                                    </p>

                                    <span
                                        style={
                                            blog.published
                                                ? styles.published
                                                : styles.draft
                                        }
                                    >
                                        {blog.published
                                            ? "Published"
                                            : "Draft"}
                                    </span>

                                </div>

                                <div style={styles.actions}>

                                    <button
                                        onClick={() =>
                                            handleEdit(blog)
                                        }
                                        style={styles.editButton}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(blog.id)
                                        }
                                        style={styles.deleteButton}
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

    loading: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "20px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },

    heading: {
        margin: "0"
    },

    subtitle: {
        color: "#666",
        marginTop: "8px"
    },

    backButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        background: "#374151",
        color: "#ffffff",
        cursor: "pointer"
    },

    formCard: {
        maxWidth: "850px",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "30px"
    },

    listCard: {
        maxWidth: "1100px",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
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

    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "20px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    buttonRow: {
        display: "flex",
        gap: "10px",
        marginTop: "25px"
    },

    saveButton: {
        padding: "13px 25px",
        border: "none",
        borderRadius: "6px",
        background: "#111827",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "15px"
    },

    cancelButton: {
        padding: "13px 25px",
        border: "none",
        borderRadius: "6px",
        background: "#6b7280",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "15px"
    },

    message: {
        marginTop: "20px",
        padding: "12px",
        background: "#f3f4f6",
        borderRadius: "6px",
        fontWeight: "bold"
    },

    empty: {
        color: "#666"
    },

    blogList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    blogItem: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px"
    },

    coverImage: {
        width: "150px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "8px"
    },

    blogContent: {
        flex: 1
    },

    blogTitle: {
        margin: "0 0 5px"
    },

    slug: {
        color: "#666",
        margin: "0 0 10px"
    },

    excerpt: {
        margin: "0 0 10px"
    },

    author: {
        color: "#555",
        margin: "0 0 10px"
    },

    published: {
        display: "inline-block",
        padding: "5px 10px",
        background: "#16a34a",
        color: "#ffffff",
        borderRadius: "4px",
        fontSize: "12px"
    },

    draft: {
        display: "inline-block",
        padding: "5px 10px",
        background: "#6b7280",
        color: "#ffffff",
        borderRadius: "4px",
        fontSize: "12px"
    },

    actions: {
        display: "flex",
        gap: "8px"
    },

    editButton: {
        padding: "9px 15px",
        border: "none",
        borderRadius: "5px",
        background: "#2563eb",
        color: "#ffffff",
        cursor: "pointer"
    },

    deleteButton: {
        padding: "9px 15px",
        border: "none",
        borderRadius: "5px",
        background: "#dc2626",
        color: "#ffffff",
        cursor: "pointer"
    }
};

export default Blogs;