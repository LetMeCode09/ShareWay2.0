import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { http } from "../../api/http";

export default function RegisterPage() {
    const [name, setName]         = useState("");
    const [email, setEmail]       = useState("");
    const [phone, setPhone]       = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm]   = useState("");
    const [error, setError]       = useState(null);
    const [loading, setLoading]   = useState(false);
    const { login }  = useAuth();
    const navigate   = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const { data } = await http.post("/auth/register", { name, email, phone, password });
            login(data.token, { email: data.email, role: data.role });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message ?? "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 style={{ margin: "0 0 20px", letterSpacing: "-0.02em" }}>Create an account</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700, color: "var(--muted)" }}>
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="your full name"
                            required
                            autoFocus
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700, color: "var(--muted)" }}>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700, color: "var(--muted)" }}>
                        Phone
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="612345678"
                            required
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
                    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700, color: "var(--muted)" }}>
                        Confirm password
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </label>
                    {error && <div className="error" style={{ marginTop: 0 }}>{error}</div>}
                    <button type="submit" disabled={loading} style={{ marginTop: 4 }}>
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: 18, color: "var(--muted)" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--brand)", fontWeight: 700 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
