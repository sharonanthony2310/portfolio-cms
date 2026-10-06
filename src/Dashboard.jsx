import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "About", path: "/about" },
        { name: "Skills", path: "/skills" },
        { name: "Projects", path: "/projects" },
        { name: "Blogs", path: "/blogs" },
        { name: "Experience", path: "/experience" },
        { name: "Testimonials", path: "/testimonials" },
        { name: "Services", path: "/services" },
        { name: "Media", path: "/media" },
        { name: "Messages", path: "/messages" }
    ];

    return (
        <div style={styles.container}>

            <aside style={styles.sidebar}>

                <div>
                    <h2 style={styles.logo}>
                        Portfolio CMS
                    </h2>

                    <nav>
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() =>
                                    navigate(item.path)
                                }
                                style={styles.menuButton}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={logout}
                    style={styles.logout}
                >
                    Logout
                </button>

            </aside>

            <main style={styles.main}>

                <div style={styles.header}>
                    <div>
                        <h1>
                            Dashboard
                        </h1>

                        <p style={styles.welcome}>
                            Welcome back, {user.name || "Admin"}
                        </p>
                    </div>
                </div>

                <div style={styles.cards}>

                    <div style={styles.card}>
                        <h3>Projects</h3>
                        <p>Manage your portfolio projects.</p>
                    </div>

                    <div style={styles.card}>
                        <h3>Blogs</h3>
                        <p>Create and manage blog posts.</p>
                    </div>

                    <div style={styles.card}>
                        <h3>Experience</h3>
                        <p>Manage your career timeline.</p>
                    </div>

                    <div style={styles.card}>
                        <h3>Messages</h3>
                        <p>View contact form messages.</p>
                    </div>

                </div>

            </main>

        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5"
    },

    sidebar: {
        width: "240px",
        background: "#111827",
        color: "#ffffff",
        padding: "25px 15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box"
    },

    logo: {
        margin: "0 10px 30px",
        fontSize: "21px"
    },

    menuButton: {
        width: "100%",
        display: "block",
        padding: "12px 10px",
        marginBottom: "5px",
        background: "transparent",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "15px"
    },

    logout: {
        padding: "12px",
        background: "#dc2626",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px"
    },

    main: {
        flex: 1,
        padding: "40px"
    },

    header: {
        marginBottom: "35px"
    },

    welcome: {
        color: "#666",
        marginTop: "5px"
    },

    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
    },

    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)"
    }
};

export default Dashboard;