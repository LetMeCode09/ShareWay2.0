import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { http } from "../../api/http";

export default function LoginPage() {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState(null);
    const [loading, setLoading]   = useState(false);
    const { login }  = useAuth();
    const navigate   = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const { data } = await http.post("/auth/login", { email, password });
            login(data.token, { email: data.email, role: data.role });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message ?? "Invalid credentials");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 style={{ margin: "0 0 20px", letterSpacing: "-0.02em" }}>Sign in to ShareWay</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700, color: "var(--muted)" }}>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            autoFocus
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700, color: "var(--muted)" }}>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </label>
                    {error && <div className="error" style={{ marginTop: 0 }}>{error}</div>}
                    <button type="submit" disabled={loading} style={{ marginTop: 4 }}>
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: 18, color: "var(--muted)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--brand)", fontWeight: 700 }}>Register</Link>
                </p>
            </div>
        </div>
    );
}
