import { useEffect, useState } from "react";
import axios from "axios";

function Skills() {
    const [skills, setSkills] = useState([]);

    const [form, setForm] = useState({
        name: "",
        category: "",
        proficiency: 0,
        icon: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_URL = "http://localhost:5000/skills";

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchSkills = async () => {
        try {
            const response = await axios.get(API_URL);

            setSkills(response.data);

        } catch (error) {
            console.error(
                "SKILLS FETCH ERROR:",
                error
            );

            setMessage(
                "Failed to load skills"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            name: "",
            category: "",
            proficiency: 0,
            icon: ""
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
                name: form.name,
                category: form.category,
                proficiency: Number(
                    form.proficiency
                ),
                icon: form.icon
            };

            if (editingId) {

                await axios.put(
                    `${API_URL}/${editingId}`,
                    data,
                    config
                );

                setMessage(
                    "Skill updated successfully"
                );

            } else {

                await axios.post(
                    API_URL,
                    data,
                    config
                );

                setMessage(
                    "Skill added successfully"
                );
            }

            resetForm();

            await fetchSkills();

        } catch (error) {
            console.error(
                "SKILLS SAVE ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to save skill"
            );

        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill) => {
        setForm({
            name: skill.name || "",
            category: skill.category || "",
            proficiency:
                skill.proficiency || 0,
            icon: skill.icon || ""
        });

        setEditingId(skill.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this skill?"
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
                "Skill deleted successfully"
            );

            await fetchSkills();

        } catch (error) {
            console.error(
                "SKILLS DELETE ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to delete skill"
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
                Loading Skills...
            </div>
        );
    }

    return (
        <div style={styles.page}>

            <div style={styles.header}>

                <div>
                    <h1 style={styles.heading}>
                        Skills
                    </h1>

                    <p style={styles.subtitle}>
                        Add and manage your skills.
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
                        ? "Edit Skill"
                        : "Add Skill"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label style={styles.label}>
                        Skill Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Example: UI/UX Design"
                        style={styles.input}
                        required
                    />

                    <label style={styles.label}>
                        Category
                    </label>

                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Example: Design"
                        style={styles.input}
                    />

                    <label style={styles.label}>
                        Proficiency
                    </label>

                    <div
                        style={
                            styles.proficiencyRow
                        }
                    >

                        <input
                            type="range"
                            name="proficiency"
                            min="0"
                            max="100"
                            value={
                                form.proficiency
                            }
                            onChange={handleChange}
                            style={styles.range}
                        />

                        <span
                            style={
                                styles.proficiencyValue
                            }
                        >
                            {form.proficiency}%
                        </span>

                    </div>

                    <label style={styles.label}>
                        Icon
                    </label>

                    <input
                        type="text"
                        name="icon"
                        value={form.icon}
                        onChange={handleChange}
                        placeholder="Example: 🎨"
                        style={styles.input}
                    />

                    <div style={styles.buttonRow}>

                        <button
                            type="submit"
                            style={
                                styles.saveButton
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Skill"
                                    : "Add Skill"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={
                                    resetForm
                                }
                                style={
                                    styles.cancelButton
                                }
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
                    Your Skills
                </h2>

                {skills.length === 0 ? (

                    <p style={styles.empty}>
                        No skills added yet.
                    </p>

                ) : (

                    <div style={styles.skillList}>

                        {skills.map((skill) => (

                            <div
                                key={skill.id}
                                style={styles.skillItem}
                            >

                                <div
                                    style={
                                        styles.skillInfo
                                    }
                                >

                                    <div
                                        style={
                                            styles.icon
                                        }
                                    >
                                        {skill.icon ||
                                            "•"}
                                    </div>

                                    <div>

                                        <h3
                                            style={
                                                styles.skillName
                                            }
                                        >
                                            {skill.name}
                                        </h3>

                                        <p
                                            style={
                                                styles.category
                                            }
                                        >
                                            {skill.category ||
                                                "No category"}
                                        </p>

                                        <div
                                            style={
                                                styles.progressBackground
                                            }
                                        >

                                            <div
                                                style={{
                                                    ...styles.progress,
                                                    width:
                                                        `${skill.proficiency || 0}%`
                                                }}
                                            />

                                        </div>

                                        <small>
                                            {skill.proficiency ||
                                                0}
                                            %
                                        </small>

                                    </div>

                                </div>

                                <div
                                    style={
                                        styles.actions
                                    }
                                >

                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                skill
                                            )
                                        }
                                        style={
                                            styles.editButton
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                skill.id
                                            )
                                        }
                                        style={
                                            styles.deleteButton
                                        }
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
        maxWidth: "800px",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        marginBottom: "30px"
    },

    listCard: {
        maxWidth: "1000px",
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

    proficiencyRow: {
        display: "flex",
        alignItems: "center",
        gap: "15px"
    },

    range: {
        flex: 1
    },

    proficiencyValue: {
        width: "50px",
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

    skillList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    skillItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px"
    },

    skillInfo: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flex: 1
    },

    icon: {
        width: "45px",
        height: "45px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        borderRadius: "8px",
        fontSize: "22px"
    },

    skillName: {
        margin: "0 0 5px"
    },

    category: {
        margin: "0 0 10px",
        color: "#666"
    },

    progressBackground: {
        width: "250px",
        height: "7px",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "5px"
    },

    progress: {
        height: "100%",
        background: "#111827",
        borderRadius: "10px"
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

export default Skills;