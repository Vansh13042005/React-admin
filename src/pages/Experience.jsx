import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Briefcase, Calendar, Building2, } from "lucide-react";
import { useToast } from "../context/ToastContext";
// import Card from "../components/UI/Card";
// import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import ConfirmModal from "../components/UI/ConfirmModal";
import Input from "../components/UI/Input";

const ExperiencePage = () => {
  const { addToast } = useToast();

  const [experience, setExperience] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const fetchExperience = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await fetch("https://profolionode.vanshpatel.in/api/experience", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExperience(data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setEditingId(exp.id);
      setFormData({
        company: exp.company || "",
        role: exp.role || "",
        start_date: exp.start_date ? exp.start_date.split("T")[0] : "",
        end_date: exp.end_date ? exp.end_date.split("T")[0] : "",
        description: exp.description || "",
      });
    } else {
      setEditingId(null);
      setFormData({ company: "", role: "", start_date: "", end_date: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.company || !formData.role) {
      addToast("Fill required fields", "error");
      return;
    }
    setIsLoading(true);
    try {
      const url = editingId
        ? `https://profolionode.vanshpatel.in/api/experience/${editingId}`
        : `https://profolionode.vanshpatel.in/api/experience`;
      const method = editingId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      addToast(editingId ? "Updated successfully" : "Added successfully", "success");
      setIsModalOpen(false);
      fetchExperience();
    } catch (err) {
      addToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await fetch(`https://profolionode.vanshpatel.in/api/experience/${confirmDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast("Deleted successfully", "success");
      setConfirmDelete(null);
      fetchExperience();
    } catch (err) {
      addToast("Delete failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const getDuration = (start, end) => {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m}mo`;
    if (m === 0) return `${y}yr`;
    return `${y}yr ${m}mo`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .exp-page { font-family: 'DM Sans', sans-serif; }
        .exp-page h1, .exp-page h2, .exp-page h3 { font-family: 'Syne', sans-serif; }

        .exp-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 10px;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(99,102,241,0.35);
        }
        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.45);
        }

        .exp-timeline {
          position: relative;
          padding-left: 32px;
        }
        .exp-timeline::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6, transparent);
          border-radius: 2px;
        }

        .exp-card {
          position: relative;
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 20px;
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .dark .exp-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        }
        .exp-card:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.12);
          border-color: #c7d2fe;
        }
        .dark .exp-card:hover { border-color: #4f46e5; }

        .exp-dot {
          position: absolute;
          left: -38px;
          top: 26px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: 3px solid white;
          box-shadow: 0 0 0 2px #6366f1;
        }
        .dark .exp-dot { border-color: #1e293b; }

        .role-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .dark .role-title { color: #f1f5f9; }

        .company-name {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6366f1;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .date-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 8px;
        }
        .dark .date-chip { background: #0f172a; border-color: #334155; color: #94a3b8; }

        .duration-chip {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #ede9fe, #dbeafe);
          color: #6366f1;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          letter-spacing: 0.05em;
        }
        .dark .duration-chip { background: rgba(99,102,241,0.15); }

        .desc-text {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
        }
        .dark .desc-text { color: #94a3b8; border-color: #334155; }

        .action-btn {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .edit-btn {
          background: #eff6ff;
          color: #3b82f6;
        }
        .edit-btn:hover { background: #3b82f6; color: white; transform: scale(1.08); }
        .delete-btn {
          background: #fff1f2;
          color: #ef4444;
        }
        .delete-btn:hover { background: #ef4444; color: white; transform: scale(1.08); }
        .dark .edit-btn { background: rgba(59,130,246,0.15); }
        .dark .delete-btn { background: rgba(239,68,68,0.15); }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }
        .empty-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #ede9fe, #dbeafe);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .current-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #dcfce7;
          color: #16a34a;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }
        .current-dot {
          width: 6px; height: 6px;
          background: #16a34a;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        .dark .current-badge { background: rgba(22,163,74,0.15); }
      `}</style>

      <div className="exp-page space-y-8">

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="exp-header-badge">
              <Briefcase size={11} />
              Career Timeline
            </div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, margin: 0 }}
              className="text-slate-900 dark:text-white">
              Work Experience
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
              {experience.length} position{experience.length !== 1 ? 's' : ''} on record
            </p>
          </div>

          <button className="add-btn" onClick={() => handleOpenModal()}>
            <Plus size={16} />
            Add Experience
          </button>
        </div>

        {/* TIMELINE LIST */}
        {isFetching ? (
          <div className="exp-timeline">
            {[1, 2, 3].map(i => (
              <div key={i} className="exp-card" style={{ marginLeft: '8px' }}>
                <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: '25%', marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 14, width: '80%' }} />
              </div>
            ))}
          </div>
        ) : experience.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Briefcase size={28} color="#8b5cf6" />
            </div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#475569', marginBottom: 6 }}>
              No experience added yet
            </p>
            <p style={{ fontSize: '14px' }}>Click "Add Experience" to get started</p>
          </div>
        ) : (
          <div className="exp-timeline">
            {experience.map((exp, index) => (
              <div
                key={exp.id}
                className="exp-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="exp-dot" />

                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="role-title">{exp.role}</h3>
                    <div className="company-name">
                      <Building2 size={13} />
                      {exp.company}
                    </div>

                    {/* Date chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="date-chip">
                        <Calendar size={11} />
                        {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : (
                          <span className="current-badge" style={{ padding: 0, background: 'none', fontSize: '12px' }}>
                            <span className="current-dot" /> Present
                          </span>
                        )}
                      </span>

                      <span className="duration-chip">
                        {getDuration(exp.start_date, exp.end_date)}
                      </span>

                      {!exp.end_date && (
                        <span className="current-badge">
                          <span className="current-dot" /> Current
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className="action-btn edit-btn" onClick={() => handleOpenModal(exp)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => setConfirmDelete(exp.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="desc-text">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Edit Experience" : "Add Experience"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <Input
          label="Company *"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="e.g. Google"
        />
        <Input
          label="Role *"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="e.g. Frontend Developer"
        />
        <Input
          label="Start Date"
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
        />
        <Input
          label="End Date (leave empty if current)"
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What did you work on?"
        />
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        isLoading={isLoading}
      />
    </>
  );
};

export default ExperiencePage;