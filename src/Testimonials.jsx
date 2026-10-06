import { useEffect, useState } from "react";
import axios from "axios";

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);

    const [form, setForm] = useState({
        name: "",
        role: "",
        company: "",
        message: "",
        image: ""
    });

    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/testimonials"
            );

            setTestimonials(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load testimonials");
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/testimonials/${editingId}`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Testimonial updated successfully");
            } else {
                await axios.post(
                    "http://localhost:5000/testimonials",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Testimonial added successfully");
            }

            resetForm();
            fetchTestimonials();

        } catch (error) {
            console.error(error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                alert("Session expired. Please login again.");
            } else {
                alert(
                    error.response?.data?.message ||
                    "Failed to save testimonial"
                );
            }
        }
    };

    const handleEdit = (testimonial) => {
        setEditingId(testimonial.id);

        setForm({
            name: testimonial.name || "",
            role: testimonial.role || "",
            company: testimonial.company || "",
            message: testimonial.message || "",
            image: testimonial.image || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this testimonial?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/testimonials/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Testimonial deleted successfully");

            fetchTestimonials();

        } catch (error) {
            console.error(error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                alert("Session expired. Please login again.");
            } else {
                alert(
                    error.response?.data?.message ||
                    "Failed to delete testimonial"
                );
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            name: "",
            role: "",
            company: "",
            message: "",
            image: ""
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
                    <h1>Testimonials Management</h1>

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
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>
                        {editingId
                            ? "Edit Testimonial"
                            : "Add Testimonial"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="name"
                            placeholder="Person Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <input
                            type="text"
                            name="role"
                            placeholder="Role / Position"
                            value={form.role}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <input
                            type="text"
                            name="company"
                            placeholder="Company"
                            value={form.company}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <input
                            type="text"
                            name="image"
                            placeholder="Image URL"
                            value={form.image}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <textarea
                            name="message"
                            placeholder="Testimonial message"
                            value={form.message}
                            onChange={handleChange}
                            rows="5"
                            required
                            style={{
                                ...inputStyle,
                                resize: "vertical"
                            }}
                        />

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
                                ? "Update Testimonial"
                                : "Add Testimonial"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
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
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>Testimonials List</h2>

                    {testimonials.length === 0 ? (
                        <p>No testimonials added yet.</p>
                    ) : (
                        testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    marginBottom: "15px"
                                }}
                            >
                                {testimonial.image && (
                                    <img
                                        src={
                                            testimonial.image.startsWith(
                                                "http"
                                            )
                                                ? testimonial.image
                                                : `http://localhost:5000${testimonial.image}`
                                        }
                                        alt={testimonial.name}
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                            marginBottom: "10px"
                                        }}
                                    />
                                )}

                                <h3>
                                    {testimonial.name}
                                </h3>

                                {(testimonial.role ||
                                    testimonial.company) && (
                                    <p>
                                        {testimonial.role}

                                        {testimonial.role &&
                                            testimonial.company
                                            ? " at "
                                            : ""}

                                        {testimonial.company}
                                    </p>
                                )}

                                <p>
                                    "{testimonial.message}"
                                </p>

                                <button
                                    onClick={() =>
                                        handleEdit(testimonial)
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
                                        handleDelete(testimonial.id)
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

export default Testimonials;