import { useEffect, useState } from "react";
import { FileText, MessageSquare, Zap } from "lucide-react";
import Card from "../components/UI/Card";
import StatCard from "../components/UI/StatCard";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
const token = localStorage.getItem("token");
  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        "https://mysql-wwbk.onrender.com/api/dashboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    fetchDashboard();
  }
}, [token]); // ✅ FIX

  if (loading) {
    return <p className="text-center mt-10">Loading Dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* ✅ Overview Stats (API Based) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          title="Total Projects"
          value={dashboard?.totalProjects || 0}
        />

        <StatCard
          icon={Zap}
          title="Total Skills"
          value={dashboard?.totalSkills || 0}
        />

        <StatCard
          icon={MessageSquare}
          title="New Messages"
          value={dashboard?.unreadMessages || 0}
        />
      </div>

      {/* ✅ Quick Summary (FULL API BASED) */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Quick Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {dashboard?.totalProjects || 0}
            </p>
            <p className="text-sm mt-1">Projects</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {dashboard?.totalSkills || 0}
            </p>
            <p className="text-sm mt-1">Skills</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {dashboard?.totalMessages - dashboard?.unreadMessages || 0}
            </p>
            <p className="text-sm mt-1">Read Messages</p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">
              {dashboard?.unreadMessages || 0}
            </p>
            <p className="text-sm mt-1">Unread Messages</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;