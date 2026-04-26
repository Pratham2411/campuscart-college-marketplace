import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/formatters.js";

export default function LoginPage() {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formValues);
      navigate(location.state?.from || "/marketplace");
    } catch (loginError) {
      setError(getApiErrorMessage(loginError, "Unable to log you in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="surface-card space-y-6 px-6 py-8 sm:px-8">
        <div>
          <p className="pill">Welcome back</p>
          <h1 className="mt-4 text-3xl font-bold text-ink">Log in to CampusCart</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pick up where you left off and get back to campus deals.
          </p>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label-text" htmlFor="email">
              Email
            </label>
            <input
              className="input-field"
              id="email"
              onChange={(event) =>
                setFormValues((current) => ({ ...current, email: event.target.value }))
              }
              type="email"
              value={formValues.email}
            />
          </div>
          <div>
            <label className="label-text" htmlFor="password">
              Password
            </label>
            <input
              className="input-field"
              id="password"
              onChange={(event) =>
                setFormValues((current) => ({ ...current, password: event.target.value }))
              }
              type="password"
              value={formValues.password}
            />
          </div>
          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-500">
          New here?{" "}
          <Link className="font-semibold text-accent" to="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
