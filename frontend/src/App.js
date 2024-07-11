import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
// pages & compenents
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import ContactUs from "./pages/ContactUs";
function App() {
    const { user } = useAuthContext();
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <div className="pages">
                    <Routes>
                        <Route path="/contactus" element={<ContactUs />} />
                        <Route
                            path="/"
                            element={user ? <Home /> : <Navigate to="/login" />}
                        />
                    </Routes>
                    <Routes>
                        <Route
                            path="/login"
                            element={!user ? <Login /> : <Navigate to="/" />}
                        />
                    </Routes>
                    <Routes>
                        <Route
                            path="/signup"
                            element={!user ? <Signup /> : <Navigate to="/" />}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
