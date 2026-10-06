import { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
    const [projects, setProjects] = useState([]);

    const [form, setForm] = useState({
        title: "",
        slug: "",
        description: "",
        image: "",
        technologies: "",
        project_url: "",
        github_url: "",
        featured: false
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_URL = "http://localhost:5000/projects";

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get(API_URL);

            setProjects(response.data);

        } catch (error) {
            console.error(
                "PROJECTS FETCH ERROR:",
                error
            );

            setMessage(
                "Failed to load projects"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    };

    const resetForm = () => {
        setForm({
            title: "",
            slug: "",
            description: "",
            image: "",
            technologies: "",
            project_url: "",
            github_url: "",
            featured: false
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const token = getToken();

            if (!token) {
                setMessage(
                    "You are not logged in."
                );
                return;
            }

            const config = {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            };

            const data = {
                title: form.title,
                slug: form.slug,
                description: form.description,
                image: form.image,
                technologies: form.technologies,
                project_url: form.project_url,
                github_url: form.github_url,
                featured: form.featured
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/${editingId}`,
                    data,
                    config
                );

                setMessage(
                    "Project updated successfully"
                );
            } else {
                await axios.post(
                    API_URL,
                    data,
                    config
                );

                setMessage(
                    "Project added successfully"
                );
            }

            resetForm();

            await fetchProjects();

        } catch (error) {
            console.error(
                "PROJECT SAVE ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to save project"
            );

        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        setForm({
            title: project.title || "",
            slug: project.slug || "",
            description:
                project.description || "",
            image: project.image || "",
            technologies:
                project.technologies || "",
            project_url:
                project.project_url || "",
            github_url:
                project.github_url || "",
            featured:
                project.featured || false
        });

        setEditingId(project.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = getToken();

            await axios.delete(
                `${API_URL}/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setMessage(
                "Project deleted successfully"
            );

            await fetchProjects();

        } catch (error) {
            console.error(
                "PROJECT DELETE ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to delete project"
            );
        }
    };

    const goToDashboard = () => {
        window.location.href =
            "/dashboard";
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading Projects...
            </div>
        );
    }

    return (
        <div style={styles.page}>

            <div style={styles.header}>

                <div>
                    <h1 style={styles.heading}>
                        Projects
                    </h1>

                    <p style={styles.subtitle}>
                        Add and manage your portfolio projects.
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
                    {editingId
                        ? "Edit Project"
                        : "Add Project"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label style={styles.label}>
                        Project Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Example: My Portfolio Website"
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
                        placeholder="Example: my-portfolio-website"
                        style={styles.input}
                        required
                    />

                    <label style={styles.label}>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your project"
                        rows="6"
                        style={styles.textarea}
                    />

                    <label style={styles.label}>
                        Image URL
                    </label>

                    <input
                        type="text"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="Enter project image URL"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Technologies
                    </label>

                    <input
                        type="text"
                        name="technologies"
                        value={form.technologies}
                        onChange={handleChange}
                        placeholder="Example: React, Node.js, PostgreSQL"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Project URL
                    </label>

                    <input
                        type="text"
                        name="project_url"
                        value={form.project_url}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        GitHub URL
                    </label>

                    <input
                        type="text"
                        name="github_url"
                        value={form.github_url}
                        onChange={handleChange}
                        placeholder="https://github.com/username/project"
                        style={styles.input}
                    />

                    <label style={styles.checkboxLabel}>

                        <input
                            type="checkbox"
                            name="featured"
                            checked={form.featured}
                            onChange={handleChange}
                        />

                        <span>
                            Featured Project
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
                                    ? "Update Project"
                                    : "Add Project"}
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
                    Your Projects
                </h2>

                {projects.length === 0 ? (

                    <p style={styles.empty}>
                        No projects added yet.
                    </p>

                ) : (

                    <div style={styles.projectList}>

                        {projects.map((project) => (

                            <div
                                key={project.id}
                                style={styles.projectItem}
                            >

                                <div style={styles.projectContent}>

                                    {project.image && (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            style={styles.projectImage}
                                        />
                                    )}

                                    <div>

                                        <h3 style={styles.projectTitle}>
                                            {project.title}
                                        </h3>

                                        <p style={styles.slug}>
                                            /{project.slug}
                                        </p>

                                        <p style={styles.description}>
                                            {project.description ||
                                                "No description"}
                                        </p>

                                        <p style={styles.technologies}>
                                            <strong>
                                                Technologies:
                                            </strong>{" "}
                                            {project.technologies ||
                                                "Not specified"}
                                        </p>

                                        {project.featured && (
                                            <span style={styles.featured}>
                                                Featured
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <div style={styles.actions}>

                                    <button
                                        onClick={() =>
                                            handleEdit(project)
                                        }
                                        style={styles.editButton}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(project.id)
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
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "30px"
    },

    listCard: {
        maxWidth: "1100px",
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

    projectList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    projectItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px"
    },

    projectContent: {
        display: "flex",
        gap: "20px",
        flex: 1
    },

    projectImage: {
        width: "140px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "8px"
    },

    projectTitle: {
        margin: "0 0 5px"
    },

    slug: {
        color: "#666",
        margin: "0 0 10px"
    },

    description: {
        margin: "0 0 10px"
    },

    technologies: {
        margin: "0 0 10px",
        color: "#555"
    },

    featured: {
        display: "inline-block",
        padding: "5px 10px",
        background: "#111827",
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

export default Projects;