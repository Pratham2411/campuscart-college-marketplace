import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/formatters.js";

export default function SignupPage() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(formValues);
      navigate("/marketplace");
    } catch (signupError) {
      setError(getApiErrorMessage(signupError, "Unable to create your account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="surface-card space-y-6 px-6 py-8 sm:px-8">
        <div>
          <p className="pill">Join the community</p>
          <h1 className="mt-4 text-3xl font-bold text-ink">Create your CampusCart account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Start listing, messaging, saving, and reviewing in one place.
          </p>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label-text" htmlFor="name">
              Name
            </label>
            <input
              className="input-field"
              id="name"
              onChange={(event) =>
                setFormValues((current) => ({ ...current, name: event.target.value }))
              }
              value={formValues.name}
            />
          </div>
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
              minLength="6"
              onChange={(event) =>
                setFormValues((current) => ({ ...current, password: event.target.value }))
              }
              type="password"
              value={formValues.password}
            />
          </div>
          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-slate-500">
          Already registered?{" "}
          <Link className="font-semibold text-accent" to="/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
