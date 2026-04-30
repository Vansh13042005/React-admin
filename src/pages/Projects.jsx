import React, { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Eye, Image, X } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import ConfirmModal from "../components/UI/ConfirmModal";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";

const ProjectsPage = () => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [projects, setProjects]           = useState([]);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingId, setEditingId]         = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading]         = useState(false);

  // ✅ imageFile = actual File object, imagePreview = local blob URL for preview
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    tech: "",
    category: "",
    description: "",
    link: "",
    github: "",
    image: "",   // stores existing URL in edit mode
  });

  const token = localStorage.getItem("token");

  // ── Parse tech from DB string/array ────────────────────────────────────────
  const parseTech = (techValue) => {
    if (!techValue) return [];
    if (Array.isArray(techValue)) return techValue;
    try {
      const parsed = JSON.parse(techValue);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return techValue
      .replace(/[{}"]/g, "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  // ── GET Projects ────────────────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
  try {
    const res = await fetch("https://profolionode.vanshpatel.in/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const fixedData = (data.data || []).map((p) => ({
      ...p,
      tech: parseTech(p.tech),
    }));
    setProjects(fixedData);
  } catch (err) {
    console.log(err);
  }
}, [token]);

useEffect(() => {
  fetchProjects();
}, [fetchProjects]);

  // ── Open Modal ──────────────────────────────────────────────────────────────
  const handleOpenModal = (project = null) => {
    setImageFile(null);
    setImagePreview(null);

    if (project) {
      setEditingId(project.id);
      setFormData({
        ...project,
        tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech,
      });
      if (project.image) setImagePreview(project.image); // show existing image
    } else {
      setEditingId(null);
      setFormData({ title: "", tech: "", category: "", description: "", link: "", github: "", image: "" });
    }
    setIsModalOpen(true);
  };

  // ── Image File Select ───────────────────────────────────────────────────────
  const handleImageSelect = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      addToast("Only JPEG, PNG, WEBP allowed", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast("Image must be under 5 MB", "error");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── ADD / UPDATE ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.title || !formData.category) {
      addToast("Fill required fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      const url = editingId
        ? `https://profolionode.vanshpatel.in/api/projects/${editingId}`
        : `https://profolionode.vanshpatel.in/api/projects`;

      const method = editingId ? "PUT" : "POST";

      // ✅ FormData use karo — JSON nahi — taaki image file bhi saath jaa sake
      const body = new FormData();
      body.append("title",       formData.title);
      body.append("description", formData.description);
      body.append("category",    formData.category);
      body.append("link",        formData.link);
      body.append("github",      formData.github);

      // tech → JSON array string
      const techArray = formData.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      body.append("tech", JSON.stringify(techArray));

      // ✅ Naya file select hua to append karo, warna backend purana rakhe ga
      if (imageFile) {
        body.append("image", imageFile);
      }

      // ⚠️ Content-Type header mat set karo — browser khud multipart/form-data set karta hai
      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      addToast(editingId ? "Updated" : "Added", "success");
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      addToast("Error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await fetch(
        `https://profolionode.vanshpatel.in/api/projects/${confirmDelete}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Deleted", "success");
      setConfirmDelete(null);
      fetchProjects();
    } catch (err) {
      addToast("Delete failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add Project
        </Button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            {/* ✅ Project Image */}
            <div className="w-full h-40 mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full items-center justify-center"
                style={{ display: project.image ? "none" : "flex" }}
              >
                <Image size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {project.category}
              </span>
              <div className="flex gap-2">
                <Edit2 size={16} className="cursor-pointer" onClick={() => handleOpenModal(project)} />
                <Trash2 size={16} className="cursor-pointer text-red-400" onClick={() => setConfirmDelete(project.id)} />
              </div>
            </div>

            <h3 className="font-bold mb-1">{project.title}</h3>
            <p className="text-sm mb-3 line-clamp-2 text-gray-500 dark:text-gray-400">
              {project.description}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tech.map((t, i) => (
                <span key={i} className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>

            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="text-blue-500 flex items-center gap-1 text-sm">
                <Eye size={14} /> View
              </a>
            )}
          </Card>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Edit Project" : "Add Project"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <Input
          label="Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Select
          label="Category *"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={[
            { value: "",        label: "Select" },
            { value: "Web",     label: "Web" },
            { value: "App",     label: "App" },
            { value: "Backend", label: "Backend" },
            { value: "UI/UX",   label: "UI/UX" },
            { value: "Other",   label: "Other" },
          ]}
        />

        <Input
          label="Tech (comma separated)"
          placeholder="React, Node, MongoDB"
          value={formData.tech}
          onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display:"block", fontSize:14, fontWeight:500, color:"#94a3b8", marginBottom:6 }}>
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief project description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Input
          label="Live Link"
          placeholder="https://..."
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />

        <Input
          label="GitHub Link"
          placeholder="https://github.com/..."
          value={formData.github}
          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
        />

        {/* ✅ Image Upload */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display:"block", fontSize:14, fontWeight:500, color:"#94a3b8", marginBottom:6 }}>
            Project Image
          </label>

          {imagePreview ? (
            <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:"1px solid #334155" }}>
              <img
                src={imagePreview}
                alt="preview"
                style={{ width:"100%", height:160, objectFit:"cover", display:"block" }}
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={handleClearImage}
                style={{
                  position:"absolute", top:8, right:8,
                  background:"rgba(0,0,0,0.65)", border:"none",
                  borderRadius:"50%", width:28, height:28,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", color:"#fff",
                }}
              >
                <X size={14} />
              </button>
              <p style={{ padding:"6px 10px", fontSize:12, color:"#64748b", margin:0 }}>
                {imageFile ? `New: ${imageFile.name}` : "Existing image (unchanged)"}
              </p>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border:"2px dashed #334155", borderRadius:10, padding:"28px 16px",
                textAlign:"center", cursor:"pointer", transition:"border-color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#334155"}
            >
              <Image size={28} style={{ color:"#475569", margin:"0 auto 8px" }} />
              <p style={{ margin:0, fontSize:13, color:"#64748b" }}>Click to upload image</p>
              <p style={{ margin:"4px 0 0", fontSize:11, color:"#475569" }}>JPEG · PNG · WEBP · Max 5 MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display:"none" }}
            onChange={(e) => handleImageSelect(e.target.files[0])}
          />
        </div>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectsPage;