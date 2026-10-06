import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import Dashboard from "./Dashboard";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Blogs from "./Blogs";
import Experience from "./Experience";
import Testimonials from "./Testimonials";
import Services from "./Services";
import Media from "./Media";
import Messages from "./Messages";


function Login({ setLoggedIn }) {

    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");


    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response =
                await axios.post(
                    "http://localhost:5000/auth/login",
                    {
                        email,
                        password
                    }
                );


            localStorage.setItem(
                "token",
                response.data.accessToken
            );


            localStorage.setItem(
                "refreshToken",
                response.data.refreshToken
            );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );


            setLoggedIn(true);

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };


    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fb"
            }}
        >

            <form
                onSubmit={handleLogin}
                style={{
                    width: "350px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow:
                        "0 2px 15px rgba(0,0,0,0.1)"
                }}
            >

                <h1
                    style={{
                        marginBottom: "25px"
                    }}
                >
                    Admin Login
                </h1>


                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    required
                    style={inputStyle}
                />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    required
                    style={inputStyle}
                />


                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background:
                            "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>

            </form>

        </div>
    );
}


function ProtectedRoute({
    children
}) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}


function App() {

    const [loggedIn, setLoggedIn] =
        useState(
            !!localStorage.getItem(
                "token"
            )
        );


    useEffect(() => {

        const interceptor =
            axios.interceptors.response.use(

                (response) => {
                    return response;
                },

                async (error) => {

                    const originalRequest =
                        error.config;


                    if (
                        error.response?.status ===
                            401 ||
                        error.response?.status ===
                            403
                    ) {

                        if (
                            originalRequest?._retry
                        ) {

                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "refreshToken"
                            );

                            localStorage.removeItem(
                                "user"
                            );

                            setLoggedIn(false);

                            return Promise.reject(
                                error
                            );
                        }


                        originalRequest._retry =
                            true;


                        const refreshToken =
                            localStorage.getItem(
                                "refreshToken"
                            );


                        if (!refreshToken) {

                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "user"
                            );

                            setLoggedIn(false);

                            return Promise.reject(
                                error
                            );
                        }


                        try {

                            const response =
                                await axios.post(
                                    "http://localhost:5000/auth/refresh",
                                    {
                                        refreshToken
                                    }
                                );


                            const newAccessToken =
                                response.data
                                    .accessToken;


                            localStorage.setItem(
                                "token",
                                newAccessToken
                            );


                            originalRequest.headers =
                                originalRequest.headers ||
                                {};


                            originalRequest.headers.Authorization =
                                `Bearer ${newAccessToken}`;


                            return axios(
                                originalRequest
                            );

                        } catch (
                            refreshError
                        ) {

                            console.error(
                                refreshError
                            );


                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "refreshToken"
                            );

                            localStorage.removeItem(
                                "user"
                            );


                            setLoggedIn(false);


                            return Promise.reject(
                                refreshError
                            );
                        }
                    }


                    return Promise.reject(
                        error
                    );
                }
            );


        return () => {

            axios.interceptors.response.eject(
                interceptor
            );

        };

    }, []);


    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        loggedIn ? (
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        ) : (
                            <Login
                                setLoggedIn={
                                    setLoggedIn
                                }
                            />
                        )
                    }
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/about"
                    element={
                        <ProtectedRoute>
                            <About />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/skills"
                    element={
                        <ProtectedRoute>
                            <Skills />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <Projects />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/blogs"
                    element={
                        <ProtectedRoute>
                            <Blogs />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/experience"
                    element={
                        <ProtectedRoute>
                            <Experience />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/testimonials"
                    element={
                        <ProtectedRoute>
                            <Testimonials />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/services"
                    element={
                        <ProtectedRoute>
                            <Services />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/media"
                    element={
                        <ProtectedRoute>
                            <Media />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <Messages />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


const inputStyle = {

    width: "100%",

    padding: "12px",

    marginBottom: "15px",

    border:
        "1px solid #ccc",

    borderRadius: "6px",

    boxSizing:
        "border-box"
};


export default App;