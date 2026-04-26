import { ShieldAlert, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Alert from "../components/ui/Alert.jsx";
import Loader from "../components/ui/Loader.jsx";
import { formatCurrency, formatDate, getApiErrorMessage } from "../utils/formatters.js";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardRes, usersRes, productsRes, reportsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/products"),
        api.get("/admin/reports")
      ]);

      setDashboard(dashboardRes.data);
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
      setReports(reportsRes.data.reports || []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Unable to load admin dashboard."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRemoveProduct = async (productId) => {
    if (!window.confirm("Remove this listing from the marketplace?")) {
      return;
    }

    try {
      await api.delete(`/admin/products/${productId}`);
      await loadAdminData();
    } catch (removeError) {
      setError(getApiErrorMessage(removeError, "Unable to remove listing."));
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      await api.patch(`/admin/reports/${reportId}`, { status });
      await loadAdminData();
    } catch (reportError) {
      setError(getApiErrorMessage(reportError, "Unable to update report."));
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading admin workspace..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="pill">Admin Console</p>
        <h1 className="mt-3 text-4xl font-bold text-ink">Moderation and platform oversight</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Review reports, track community growth, and keep marketplace quality high.
        </p>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Users" value={dashboard?.metrics?.userCount || 0} />
        <MetricCard label="Listings" value={dashboard?.metrics?.productCount || 0} />
        <MetricCard label="Active Listings" value={dashboard?.metrics?.activeProductCount || 0} />
        <MetricCard label="Reports" value={dashboard?.metrics?.reportCount || 0} />
        <MetricCard label="Pending Reports" value={dashboard?.metrics?.pendingReportCount || 0} />
      </section>

      <AdminTable title="Users">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Listings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((platformUser) => (
              <tr key={platformUser._id}>
                <td className="py-3 font-semibold text-slate-700">{platformUser.name}</td>
                <td className="py-3 text-slate-500">{platformUser.email}</td>
                <td className="py-3 text-slate-500 capitalize">{platformUser.role}</td>
                <td className="py-3 text-slate-500">{platformUser.listingCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTable>

      <AdminTable title="Listings">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Seller</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="py-3 font-semibold text-slate-700">{product.title}</td>
                <td className="py-3 text-slate-500">{product.seller?.name}</td>
                <td className="py-3 text-slate-500">{formatCurrency(product.price)}</td>
                <td className="py-3 capitalize text-slate-500">{product.status}</td>
                <td className="py-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                    onClick={() => handleRemoveProduct(product._id)}
                    type="button"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTable>

      <AdminTable title="Reports">
        <div className="space-y-4">
          {reports.map((report) => (
            <div className="rounded-3xl border border-slate-100 p-5" key={report._id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
                    <ShieldAlert size={16} />
                    {report.reason}
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-ink">{report.product?.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Reported by {report.reporter?.name} on {formatDate(report.createdAt)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {report.details || "No extra details supplied."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["pending", "resolved", "rejected"].map((status) => (
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        report.status === status
                          ? "bg-ink text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                      key={status}
                      onClick={() => handleUpdateReport(report._id, status)}
                      type="button"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminTable>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="surface-card px-5 py-6">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

function AdminTable({ title, children }) {
  return (
    <section className="surface-card px-6 py-6">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-5 overflow-x-auto">{children}</div>
    </section>
  );
}
