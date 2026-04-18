import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import ConfirmModal from "../components/UI/ConfirmModal";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";

const ProjectsPage = () => {
  const { addToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    tech: "",
    category: "",
    description: "",
    link: "",
    github: "",
    image: "",
  });

  const token = localStorage.getItem("token");

  // ✅ FIX: tech string → array
  const parseTech = (techString) => {
    if (!techString) return [];
    return techString
      .replace(/[{}"]/g, "")
      .split(",")
      .map((t) => t.trim());
  };

  // ✅ GET PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await fetch("https://profolionode.vanshpatel.in/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ OPEN MODAL
  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        ...project,
        tech: project.tech.join(", "),
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        tech: "",
        category: "",
        description: "",
        link: "",
        github: "",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  // ✅ ADD / UPDATE
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

      const bodyData = {
        ...formData,
        tech: formData.tech.split(",").map((t) => t.trim()),
      };

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
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

  // ✅ DELETE
  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await fetch(
        `https://profolionode.vanshpatel.in/api/projects/${confirmDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add Project
        </Button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="flex justify-between mb-3">
              <span className="text-3xl">{project.image}</span>

              <div className="flex gap-2">
                <Edit2 onClick={() => handleOpenModal(project)} />
                <Trash2 onClick={() => setConfirmDelete(project.id)} />
              </div>
            </div>

            <h3 className="font-bold">{project.title}</h3>
            <p className="text-sm mb-2">{project.description}</p>

            {/* ✅ TECH TAGS */}
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tech.map((t, i) => (
                <span key={i} className="text-xs bg-blue-100 px-2 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>

            <a
              href={project.link}
              target="_blank"
              className="text-blue-500 flex items-center gap-1"
            >
              <Eye size={16} /> View
            </a>
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
          label="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          options={[
            { value: "", label: "Select" },
            { value: "Web", label: "Web" },
            { value: "App", label: "App" },
          ]}
        />

        <Input
          label="Tech"
          value={formData.tech}
          onChange={(e) =>
            setFormData({ ...formData, tech: e.target.value })
          }
          placeholder="React, Node, MongoDB"
        />

        <Input
          label="Link"
          value={formData.link}
          onChange={(e) =>
            setFormData({ ...formData, link: e.target.value })
          }
        />
      </Modal>

      {/* DELETE */}
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