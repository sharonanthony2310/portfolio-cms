import { useEffect, useState } from "react";
import axios from "axios";

function Experience() {
    const [experiences, setExperiences] = useState([]);

    const [form, setForm] = useState({
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
        current_position: false,
        location: ""
    });

    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchExperiences = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/experience"
            );

            setExperiences(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load experience");
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/experience/${editingId}`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Experience updated successfully");
            } else {
                await axios.post(
                    "http://localhost:5000/experience",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Experience added successfully");
            }

            setForm({
                company: "",
                position: "",
                description: "",
                start_date: "",
                end_date: "",
                current_position: false,
                location: ""
            });

            setEditingId(null);

            fetchExperiences();

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Session expired. Please login again.");
            } else {
                alert(
                    error.response?.data?.message ||
                    "Failed to save experience"
                );
            }
        }
    };

    const handleEdit = (experience) => {
        setEditingId(experience.id);

        setForm({
            company: experience.company || "",
            position: experience.position || "",
            description: experience.description || "",
            start_date: experience.start_date
                ? experience.start_date.substring(0, 10)
                : "",
            end_date: experience.end_date
                ? experience.end_date.substring(0, 10)
                : "",
            current_position: experience.current_position || false,
            location: experience.location || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this experience?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/experience/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Experience deleted successfully");

            fetchExperiences();

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Session expired. Please login again.");
            } else {
                alert(
                    error.response?.data?.message ||
                    "Failed to delete experience"
                );
            }
        }
    };

    const cancelEdit = () => {
        setEditingId(null);

        setForm({
            company: "",
            position: "",
            description: "",
            start_date: "",
            end_date: "",
            current_position: false,
            location: ""
        });
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
                    <h1>Experience Management</h1>

                    <button
                        onClick={() => {
                            window.location.href = "/dashboard";
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
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>
                        {editingId
                            ? "Edit Experience"
                            : "Add Experience"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="company"
                            placeholder="Company"
                            value={form.company}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <input
                            type="text"
                            name="position"
                            placeholder="Position"
                            value={form.position}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>
                            Start Date
                        </label>

                        <input
                            type="date"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>
                            End Date
                        </label>

                        <input
                            type="date"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                            disabled={form.current_position}
                            style={inputStyle}
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            rows="5"
                            style={{
                                ...inputStyle,
                                resize: "vertical"
                            }}
                        />

                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "20px"
                            }}
                        >
                            <input
                                type="checkbox"
                                name="current_position"
                                checked={form.current_position}
                                onChange={handleChange}
                            />

                            Currently working here
                        </label>

                        <button
                            type="submit"
                            style={{
                                padding: "12px 22px",
                                border: "none",
                                borderRadius: "6px",
                                background: "#2563eb",
                                color: "white",
                                cursor: "pointer",
                                marginRight: "10px"
                            }}
                        >
                            {editingId
                                ? "Update Experience"
                                : "Add Experience"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                style={{
                                    padding: "12px 22px",
                                    border: "none",
                                    borderRadius: "6px",
                                    background: "#777",
                                    color: "white",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>Experience List</h2>

                    {experiences.length === 0 ? (
                        <p>No experience added yet.</p>
                    ) : (
                        experiences.map((experience) => (
                            <div
                                key={experience.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    marginBottom: "15px"
                                }}
                            >
                                <h3>
                                    {experience.position}
                                </h3>

                                <h4>
                                    {experience.company}
                                </h4>

                                {experience.location && (
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {experience.location}
                                    </p>
                                )}

                                <p>
                                    <strong>Start:</strong>{" "}
                                    {experience.start_date
                                        ? experience.start_date.substring(0, 10)
                                        : "Not specified"}
                                </p>

                                <p>
                                    <strong>End:</strong>{" "}
                                    {experience.current_position
                                        ? "Present"
                                        : experience.end_date
                                            ? experience.end_date.substring(0, 10)
                                            : "Not specified"}
                                </p>

                                {experience.description && (
                                    <p>
                                        {experience.description}
                                    </p>
                                )}

                                {experience.current_position && (
                                    <p
                                        style={{
                                            color: "green",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Current Position
                                    </p>
                                )}

                                <button
                                    onClick={() =>
                                        handleEdit(experience)
                                    }
                                    style={{
                                        padding: "8px 15px",
                                        marginRight: "10px",
                                        border: "none",
                                        borderRadius: "5px",
                                        background: "#2563eb",
                                        color: "white",
                                        cursor: "pointer"
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(experience.id)
                                    }
                                    style={{
                                        padding: "8px 15px",
                                        border: "none",
                                        borderRadius: "5px",
                                        background: "#dc2626",
                                        color: "white",
                                        cursor: "pointer"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box"
};

const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold"
};

export default Experience;