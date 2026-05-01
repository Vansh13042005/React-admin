import React, { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Eye, Image, X, GitBranch, Globe, Layers, Code2, FolderOpen } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Modal from "../components/UI/Modal";
import ConfirmModal from "../components/UI/ConfirmModal";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";

const CATEGORY_COLORS = {
  Web:     { bg: "#eff6ff", text: "#2563eb", dark: "rgba(37,99,235,0.15)" },
  App:     { bg: "#f0fdf4", text: "#16a34a", dark: "rgba(22,163,74,0.15)" },
  Backend: { bg: "#fdf4ff", text: "#9333ea", dark: "rgba(147,51,234,0.15)" },
  "UI/UX": { bg: "#fff7ed", text: "#ea580c", dark: "rgba(234,88,12,0.15)" },
  Other:   { bg: "#f8fafc", text: "#64748b", dark: "rgba(100,116,139,0.15)" },
};

const ProjectsPage = () => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [projects, setProjects]           = useState([]);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingId, setEditingId]         = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [isFetching, setIsFetching]       = useState(true);
  const [activeFilter, setActiveFilter]   = useState("All");

  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "", tech: "", category: "", description: "", link: "", github: "", image: "",
  });

  const token = localStorage.getItem("token");

  const parseTech = (techValue) => {
    if (!techValue) return [];
    if (Array.isArray(techValue)) return techValue;
    try {
      const parsed = JSON.parse(techValue);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return techValue.replace(/[{}"]/g, "").split(",").map((t) => t.trim()).filter(Boolean);
  };

  const fetchProjects = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await fetch("https://profolionode.vanshpatel.in/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects((data.data || []).map((p) => ({ ...p, tech: parseTech(p.tech) })));
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  const handleOpenModal = (project = null) => {
    setImageFile(null);
    setImagePreview(null);
    if (project) {
      setEditingId(project.id);
      setFormData({ ...project, tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech });
      if (project.image) setImagePreview(project.image);
    } else {
      setEditingId(null);
      setFormData({ title: "", tech: "", category: "", description: "", link: "", github: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!["image/jpeg","image/jpg","image/png","image/webp"].includes(file.type)) {
      addToast("Only JPEG, PNG, WEBP allowed", "error"); return;
    }
    if (file.size > 5 * 1024 * 1024) { addToast("Image must be under 5 MB", "error"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setImageFile(null); setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category) { addToast("Fill required fields", "error"); return; }
    setIsLoading(true);
    try {
      const url = editingId
        ? `https://profolionode.vanshpatel.in/api/projects/${editingId}`
        : `https://profolionode.vanshpatel.in/api/projects`;
      const body = new FormData();
      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("category", formData.category);
      body.append("link", formData.link);
      body.append("github", formData.github);
      body.append("tech", JSON.stringify(formData.tech.split(",").map((t) => t.trim()).filter(Boolean)));
      if (imageFile) body.append("image", imageFile);
      await fetch(url, { method: editingId ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body });
      addToast(editingId ? "Updated successfully" : "Added successfully", "success");
      setIsModalOpen(false);
      fetchProjects();
    } catch { addToast("Something went wrong", "error"); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await fetch(`https://profolionode.vanshpatel.in/api/projects/${confirmDelete}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      addToast("Deleted successfully", "success");
      setConfirmDelete(null);
      fetchProjects();
    } catch { addToast("Delete failed", "error"); }
    finally { setIsLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        .proj-page { font-family: 'DM Sans', sans-serif; }
        .proj-page h1, .proj-page h2, .proj-page h3 { font-family: 'Syne', sans-serif; }

        .proj-header-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white; font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 20px; margin-bottom: 10px;
        }

        .add-proj-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white; border: none; border-radius: 12px;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
          cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(99,102,241,0.35);
        }
        .add-proj-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.45); }

        .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-pill {
          padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
          border: 1.5px solid #e2e8f0; background: transparent;
          color: #64748b; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .filter-pill:hover { border-color: #6366f1; color: #6366f1; }
        .filter-pill.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-color: transparent; color: white;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        .dark .filter-pill { border-color: #334155; color: #94a3b8; }
        .dark .filter-pill:hover { border-color: #6366f1; color: #818cf8; }

        .proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

        .proj-card {
          background: white; border: 1px solid #f1f5f9; border-radius: 20px;
          overflow: hidden; transition: all 0.3s ease;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          display: flex; flex-direction: column;
        }
        .dark .proj-card { background: #1e293b; border-color: #334155; }
        .proj-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(99,102,241,0.15); border-color: #c7d2fe; }
        .dark .proj-card:hover { border-color: #4f46e5; box-shadow: 0 20px 40px rgba(99,102,241,0.2); }

        .proj-img-wrap {
          position: relative; width: 100%; height: 180px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9); overflow: hidden;
        }
        .dark .proj-img-wrap { background: linear-gradient(135deg, #0f172a, #1e293b); }
        .proj-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .proj-card:hover .proj-img-wrap img { transform: scale(1.05); }

        .proj-img-placeholder {
          width: 100%; height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
        }
        .proj-img-icon-wrap {
          width: 52px; height: 52px; border-radius: 16px;
          background: linear-gradient(135deg, #ede9fe, #dbeafe);
          display: flex; align-items: center; justify-content: center;
        }

        .proj-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
          display: flex; align-items: flex-end; padding: 14px;
          gap: 8px;
        }
        .proj-card:hover .proj-overlay { opacity: 1; }

        .overlay-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
          border: none; cursor: pointer; text-decoration: none;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .overlay-live { background: white; color: #0f172a; }
        .overlay-live:hover { background: #f1f5f9; }
        .overlay-gh { background: rgba(255,255,255,0.15); color: white; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); }
        .overlay-gh:hover { background: rgba(255,255,255,0.25); }

        .proj-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }

        .cat-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          padding: 4px 10px; border-radius: 20px; text-transform: uppercase;
        }

        .proj-title {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px;
          color: #0f172a; margin: 10px 0 6px;
        }
        .dark .proj-title { color: #f1f5f9; }

        .proj-desc {
          font-size: 13px; color: #64748b; line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; flex: 1;
        }
        .dark .proj-desc { color: #94a3b8; }

        .tech-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .tech-tag {
          font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 6px;
          background: #f1f5f9; color: #475569; letter-spacing: 0.03em;
        }
        .dark .tech-tag { background: #0f172a; color: #94a3b8; }

        .proj-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 20px; border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }
        .dark .proj-footer { border-color: #334155; }

        .action-btn {
          width: 32px; height: 32px; border: none; border-radius: 9px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .edit-btn { background: #eff6ff; color: #3b82f6; }
        .edit-btn:hover { background: #3b82f6; color: white; transform: scale(1.08); }
        .del-btn { background: #fff1f2; color: #ef4444; }
        .del-btn:hover { background: #ef4444; color: white; transform: scale(1.08); }
        .dark .edit-btn { background: rgba(59,130,246,0.15); }
        .dark .del-btn { background: rgba(239,68,68,0.15); }

        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .empty-state { text-align: center; padding: 80px 20px; }
        .empty-icon {
          width: 72px; height: 72px; border-radius: 22px;
          background: linear-gradient(135deg, #ede9fe, #dbeafe);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }

        .upload-zone {
          border: 2px dashed #334155; border-radius: 12px;
          padding: 28px 16px; text-align: center; cursor: pointer;
          transition: all 0.2s;
        }
        .upload-zone:hover { border-color: #3b82f6; background: rgba(59,130,246,0.04); }

        .count-chip {
          display: inline-flex; align-items: center; gap: 4px;
          background: #f1f5f9; color: #64748b;
          font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
        }
        .dark .count-chip { background: #1e293b; color: #94a3b8; }
      `}</style>

      <div className="proj-page space-y-8">

        {/* HEADER */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="proj-header-badge"><Layers size={11} /> Portfolio</div>
            <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, margin: 0 }}
              className="text-slate-900 dark:text-white">Projects</h1>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
            </p>
          </div>
          <button className="add-proj-btn" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* FILTER BAR */}
        {categories.length > 1 && (
          <div className="filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
                {cat !== "All" && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>
                    ({projects.filter(p => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* GRID */}
        {isFetching ? (
          <div className="proj-grid">
            {[1,2,3].map(i => (
              <div key={i} className="proj-card">
                <div className="skeleton" style={{ height: 180 }} />
                <div style={{ padding: 20 }}>
                  <div className="skeleton" style={{ height: 14, width: '30%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '90%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FolderOpen size={30} color="#8b5cf6" /></div>
            <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: '#475569', marginBottom: 6 }}>
              {activeFilter === "All" ? "No projects yet" : `No ${activeFilter} projects`}
            </p>
            <p style={{ fontSize: 14, color: '#94a3b8' }}>
              {activeFilter === "All" ? 'Click "Add Project" to get started' : "Try a different category"}
            </p>
          </div>
        ) : (
          <div className="proj-grid">
            {filtered.map((project, index) => {
              const colors = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.Other;
              return (
                <div key={project.id} className="proj-card" style={{ animationDelay: `${index * 0.05}s` }}>

                  {/* Image */}
                  <div className="proj-img-wrap">
                    {project.image ? (
                      <img src={project.image} alt={project.title}
                        onError={(e) => { e.target.style.display="none"; }} />
                    ) : (
                      <div className="proj-img-placeholder">
                        <div className="proj-img-icon-wrap">
                          <Code2 size={24} color="#8b5cf6" />
                        </div>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>No image</span>
                      </div>
                    )}

                    {/* Hover overlay links */}
                    <div className="proj-overlay">
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="overlay-btn overlay-live">
                          <Globe size={12} /> Live
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="overlay-btn overlay-gh">
                          <GitBranch size={12} /> Code
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="proj-body">
                    <span className="cat-badge" style={{ background: colors.bg, color: colors.text }}>
                      {project.category}
                    </span>
                    <h3 className="proj-title">{project.title}</h3>
                    {project.description && <p className="proj-desc">{project.description}</p>}

                    {project.tech?.length > 0 && (
                      <div className="tech-wrap">
                        {project.tech.slice(0, 4).map((t, i) => (
                          <span key={i} className="tech-tag">{t}</span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="tech-tag">+{project.tech.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="proj-footer">
                    <div style={{ display: 'flex', gap: 6 }}>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                          style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#6366f1', fontWeight:600, textDecoration:'none' }}>
                          <Eye size={12} /> Preview
                        </a>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(project)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="action-btn del-btn" onClick={() => setConfirmDelete(project.id)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Edit Project" : "Add Project"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <Input label="Title *" value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Portfolio Website" />

        <Select label="Category *" value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={[
            { value: "", label: "Select category" },
            { value: "Web", label: "Web" },
            { value: "App", label: "App" },
            { value: "Backend", label: "Backend" },
            { value: "UI/UX", label: "UI/UX" },
            { value: "Other", label: "Other" },
          ]} />

        <Input label="Tech (comma separated)" placeholder="React, Node, MongoDB"
          value={formData.tech}
          onChange={(e) => setFormData({ ...formData, tech: e.target.value })} />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display:"block", fontSize:14, fontWeight:500, color:"#94a3b8", marginBottom:6 }}>Description</label>
          <textarea rows={3} placeholder="Brief project description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <Input label="Live Link" placeholder="https://..." value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })} />

        <Input label="GitHub Link" placeholder="https://github.com/..." value={formData.github}
          onChange={(e) => setFormData({ ...formData, github: e.target.value })} />

        {/* Image Upload */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display:"block", fontSize:14, fontWeight:500, color:"#94a3b8", marginBottom:6 }}>Project Image</label>
          {imagePreview ? (
            <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1px solid #334155" }}>
              <img src={imagePreview} alt="preview"
                style={{ width:"100%", height:160, objectFit:"cover", display:"block" }} />
              <button type="button" onClick={handleClearImage}
                style={{
                  position:"absolute", top:8, right:8,
                  background:"rgba(0,0,0,0.65)", border:"none", borderRadius:"50%",
                  width:28, height:28, display:"flex", alignItems:"center",
                  justifyContent:"center", cursor:"pointer", color:"#fff",
                }}>
                <X size={14} />
              </button>
              <p style={{ padding:"6px 10px", fontSize:12, color:"#64748b", margin:0 }}>
                {imageFile ? `New: ${imageFile.name}` : "Existing image (unchanged)"}
              </p>
            </div>
          ) : (
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              <Image size={28} style={{ color:"#475569", margin:"0 auto 8px" }} />
              <p style={{ margin:0, fontSize:13, color:"#64748b" }}>Click to upload image</p>
              <p style={{ margin:"4px 0 0", fontSize:11, color:"#475569" }}>JPEG · PNG · WEBP · Max 5 MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display:"none" }} onChange={(e) => handleImageSelect(e.target.files[0])} />
        </div>
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

export default ProjectsPage;