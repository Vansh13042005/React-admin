import React, { useEffect, useState } from "react";

const API = "https://profolionode.vanshpatel.in/api/education";

const formatYear = (dateStr) => {
  if (!dateStr) return "Present";
  return new Date(dateStr).getFullYear();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

const GradCap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Education = () => {
  const [education, setEducation] = useState([]);
  const [form, setForm] = useState({ degree: "", institution: "", start_date: "", end_date: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEducation = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setEducation(data.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchEducation(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ degree: "", institution: "", start_date: "", end_date: "", description: "" });
    setEditId(null);
    setLoading(false);
    setShowForm(false);
    fetchEducation();
  };

  const handleEdit = (item) => {
    setForm({ ...item, start_date: formatDate(item.start_date), end_date: formatDate(item.end_date) });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchEducation();
  };

  const handleCancel = () => {
    setForm({ degree: "", institution: "", start_date: "", end_date: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div style={{ padding: "2rem 2rem 3rem", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

        .edu-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 16px;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .edu-input::placeholder { color: rgba(148,163,184,0.5); }
        .edu-input:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .edu-input:hover:not(:focus) { border-color: rgba(255,255,255,0.15); }

        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
        }
        .submit-btn:hover { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(109,40,217,0.4); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .cancel-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          background: transparent;
          color: rgba(148,163,184,0.8);
          transition: all 0.2s ease;
        }
        .cancel-btn:hover { border-color: rgba(255,255,255,0.2); color: #e2e8f0; background: rgba(255,255,255,0.04); }

        .edu-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: all 0.25s ease;
          animation: slideUp 0.3s ease forwards;
        }
        .edu-card:hover {
          border-color: rgba(139,92,246,0.25);
          background: rgba(139,92,246,0.04);
          transform: translateY(-1px);
        }

        .edit-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid rgba(234,179,8,0.3);
          background: rgba(234,179,8,0.08);
          color: #fbbf24;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .edit-btn:hover { background: rgba(234,179,8,0.15); border-color: rgba(234,179,8,0.5); }

        .del-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.08);
          color: #f87171;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .del-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.5); }
        .del-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .add-edu-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(109,40,217,0.3);
        }
        .add-edu-btn:hover { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(109,40,217,0.4); }
        .add-edu-btn:active { transform: translateY(0); }

        .close-form-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.05);
          color: rgba(148,163,184,0.8);
        }
        .close-form-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); color: #e2e8f0; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes formOpen {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.75rem;
          margin-bottom: 2.5rem;
          position: relative;
          overflow: hidden;
          animation: formOpen 0.25s ease forwards;
        }
        .form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(148,163,184,0.7);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .timeline-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          flex-shrink: 0;
          margin-top: 6px;
          box-shadow: 0 0 8px rgba(139,92,246,0.5);
        }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
            <GradCap />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: "#f1f5f9", letterSpacing: "-0.01em" }}>Education</h1>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(148,163,184,0.6)" }}>{education.length} {education.length === 1 ? "entry" : "entries"} recorded</p>
          </div>
        </div>

        {/* Toggle Button */}
        {showForm ? (
          <button className="close-form-btn" onClick={handleCancel}>
            <XIcon /> Close Form
          </button>
        ) : (
          <button className="add-edu-btn" onClick={() => setShowForm(true)}>
            <PlusIcon /> Add Education
          </button>
        )}
      </div>

      {/* Form — only visible when showForm === true */}
      {showForm && (
        <div className="form-card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: editId ? "#fbbf24" : "#a78bfa", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {editId ? "✦ Editing Entry" : "✦ New Entry"}
            </span>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="field-label">Degree / Program</label>
              <input name="degree" placeholder="e.g. Bachelor of Computer Applications" value={form.degree} onChange={handleChange} className="edu-input" />
            </div>
            <div>
              <label className="field-label">Institution</label>
              <input name="institution" placeholder="e.g. Silver Oak University" value={form.institution} onChange={handleChange} className="edu-input" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label className="field-label">Start Date</label>
                <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="edu-input" style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="field-label">End Date</label>
                <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="edu-input" style={{ colorScheme: "dark" }} />
              </div>
            </div>
            <div>
              <label className="field-label">Description</label>
              <textarea name="description" placeholder="Briefly describe your studies, achievements, or coursework..." value={form.description} onChange={handleChange} className="edu-input" rows={3} style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : editId ? "Update Education" : "Save Education"}
              </button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Education List */}
      {education.length > 0 && (
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(148,163,184,0.4)", marginBottom: "1rem" }}>Timeline</p>
          <div style={{ display: "grid", gap: "12px" }}>
            {education.map((edu) => (
              <div key={edu.id} className="edu-card" style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div className="timeline-dot" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 600, color: "#f1f5f9", fontFamily: "'DM Serif Display', serif" }}>
                        {edu.degree || "—"}
                      </h3>
                      <p style={{ margin: "0 0 6px", fontSize: "13px", color: "rgba(148,163,184,0.8)" }}>{edu.institution}</p>
                      <span className="badge" style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                        {formatYear(edu.start_date)} — {formatYear(edu.end_date)}
                      </span>
                      {edu.description && (
                        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "rgba(148,163,184,0.55)", lineHeight: 1.6 }}>{edu.description}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button className="edit-btn" onClick={() => handleEdit(edu)}>
                        <PencilIcon /> Edit
                      </button>
                      <button className="del-btn" onClick={() => handleDelete(edu.id)} disabled={deleting === edu.id}>
                        <TrashIcon /> {deleting === edu.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {education.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "rgba(148,163,184,0.35)" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.5 }}>🎓</div>
          <p style={{ margin: "0 0 20px", fontSize: "14px" }}>No education entries yet.</p>
          <button className="add-edu-btn" onClick={() => setShowForm(true)} style={{ margin: "0 auto" }}>
            <PlusIcon /> Add your first entry
          </button>
        </div>
      )}
    </div>
  );
};

export default Education;