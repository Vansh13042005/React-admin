import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
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

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  // ✅ GET
  const fetchExperience = async () => {
    try {
      const res = await fetch(
        "https://profolionode.vanshpatel.in/api/experience",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setExperience(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  // ✅ OPEN MODAL
  const handleOpenModal = (exp = null) => {
    if (exp) {
      setEditingId(exp.id);
      setFormData(exp);
    } else {
      setEditingId(null);
      setFormData({
        company: "",
        role: "",
        duration: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  // ✅ ADD / UPDATE
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      addToast(editingId ? "Updated" : "Added", "success");

      setIsModalOpen(false);
      fetchExperience();
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
        `https://profolionode.vanshpatel.in/api/experience/${confirmDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addToast("Deleted", "success");
      setConfirmDelete(null);
      fetchExperience();
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
        <h2 className="text-2xl font-bold">Experience</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add
        </Button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {experience.map((exp) => (
          <Card key={exp.id}>
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">{exp.role}</h3>
                <p className="text-sm text-blue-500">{exp.company}</p>
                <p className="text-sm">{exp.duration}</p>
                <p className="text-sm">{exp.description}</p>
              </div>

              <div className="flex gap-2">
                <Edit2 onClick={() => handleOpenModal(exp)} />
                <Trash2 onClick={() => setConfirmDelete(exp.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Edit" : "Add"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <Input
          label="Company"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />

        <Input
          label="Role"
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        />

        <Input
          label="Duration"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
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

export default ExperiencePage;