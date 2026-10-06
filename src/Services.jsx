import { useEffect, useState } from "react";
import axios from "axios";

function Services() {
    const [services, setServices] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        icon: ""
    });

    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchServices = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/services"
            );

            setServices(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load services");
        }
    };

    useEffect(() => {
        fetchServices();
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
                    `http://localhost:5000/services/${editingId}`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Service updated successfully");
            } else {
                await axios.post(
                    "http://localhost:5000/services",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Service added successfully");
            }

            resetForm();
            fetchServices();

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
                    "Failed to save service"
                );
            }
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);

        setForm({
            title: service.title || "",
            description: service.description || "",
            icon: service.icon || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/services/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Service deleted successfully");

            fetchServices();

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
                    "Failed to delete service"
                );
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);

        setForm({
            title: "",
            description: "",
            icon: ""
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
                    <h1>Services Management</h1>

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
                            ? "Edit Service"
                            : "Add Service"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="title"
                            placeholder="Service Title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <input
                            type="text"
                            name="icon"
                            placeholder="Icon or Icon URL"
                            value={form.icon}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <textarea
                            name="description"
                            placeholder="Service Description"
                            value={form.description}
                            onChange={handleChange}
                            rows="5"
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
                                ? "Update Service"
                                : "Add Service"}
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
                    <h2>Services List</h2>

                    {services.length === 0 ? (
                        <p>No services added yet.</p>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    marginBottom: "15px"
                                }}
                            >
                                {service.icon && (
                                    <div
                                        style={{
                                            fontSize: "30px",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        {service.icon}
                                    </div>
                                )}

                                <h3>
                                    {service.title}
                                </h3>

                                <p>
                                    {service.description}
                                </p>

                                <button
                                    onClick={() =>
                                        handleEdit(service)
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
                                        handleDelete(service.id)
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

export default Services;