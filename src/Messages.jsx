import { useEffect, useState } from "react";
import axios from "axios";

function Messages() {
    const [messages, setMessages] = useState([]);

    const token = localStorage.getItem("token");

    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/messages",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessages(response.data);

        } catch (error) {
            console.error("MESSAGES ERROR:", error);

            alert(
                `Failed to load messages.\n\nStatus: ${
                    error.response?.status ||
                    "No response"
                }\nMessage: ${
                    error.response?.data?.message ||
                    error.message
                }`
            );
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(
                `http://localhost:5000/messages/${id}/status`,
                {
                    status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchMessages();

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update message"
            );
        }
    };

    const deleteMessage = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/messages/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Message deleted successfully.");

            fetchMessages();

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete message"
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
                    <h1>Messages Management</h1>

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
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>Contact Messages</h2>

                    {messages.length === 0 ? (
                        <p>
                            No messages received yet.
                        </p>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "8px",
                                    padding: "20px",
                                    marginBottom:
                                        "15px",
                                    background:
                                        message.status ===
                                        "unread"
                                            ? "#f0f7ff"
                                            : "white"
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        marginBottom:
                                            "10px"
                                    }}
                                >
                                    <h3>
                                        {message.subject ||
                                            "No Subject"}
                                    </h3>

                                    <span
                                        style={{
                                            padding:
                                                "5px 10px",
                                            borderRadius:
                                                "15px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "bold",
                                            background:
                                                message.status ===
                                                "unread"
                                                    ? "#fee2e2"
                                                    : "#dcfce7",
                                            color:
                                                message.status ===
                                                "unread"
                                                    ? "#b91c1c"
                                                    : "#15803d"
                                        }}
                                    >
                                        {message.status}
                                    </span>
                                </div>

                                <p>
                                    <strong>
                                        Name:
                                    </strong>{" "}
                                    {message.name}
                                </p>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {message.email}
                                </p>

                                <p>
                                    <strong>
                                        Date:
                                    </strong>{" "}
                                    {new Date(
                                        message.created_at
                                    ).toLocaleString()}
                                </p>

                                <div
                                    style={{
                                        marginTop:
                                            "15px",
                                        padding:
                                            "15px",
                                        background:
                                            "#f8f8f8",
                                        borderRadius:
                                            "6px",
                                        whiteSpace:
                                            "pre-wrap"
                                    }}
                                >
                                    {message.message}
                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            "15px"
                                    }}
                                >
                                    {message.status ===
                                        "unread" ? (
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    message.id,
                                                    "read"
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "8px 15px",
                                                marginRight:
                                                    "10px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "5px",
                                                background:
                                                    "#16a34a",
                                                color:
                                                    "white",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            Mark as Read
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    message.id,
                                                    "unread"
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "8px 15px",
                                                marginRight:
                                                    "10px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "5px",
                                                background:
                                                    "#f59e0b",
                                                color:
                                                    "white",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            Mark as Unread
                                        </button>
                                    )}

                                    <button
                                        onClick={() =>
                                            deleteMessage(
                                                message.id
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;