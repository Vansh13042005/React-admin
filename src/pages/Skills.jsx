import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import ConfirmModal from "../components/UI/ConfirmModal";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";

const SkillsPage = () => {
  const { addToast } = useToast();

  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    percentage: 50,
    icon: "",
  });

  const token = localStorage.getItem("token");

  // ✅ GET SKILLS
  const fetchSkills = async () => {
    try {
      const res = await fetch("https://profolionode.vanshpatel.in/api/skills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSkills(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ✅ OPEN MODAL
  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingId(skill.id);
      setFormData(skill);
    } else {
      setEditingId(null);
      setFormData({ name: "", category: "", percentage: 50, icon: "" });
    }
    setIsModalOpen(true);
  };

  // ✅ ADD / UPDATE
  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      addToast("Please fill required fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      const url = editingId
        ? `https://profolionode.vanshpatel.in/api/skills/${editingId}`
        : `https://profolionode.vanshpatel.in/api/skills`;

      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      addToast(editingId ? "Updated successfully" : "Added successfully", "success");

      setIsModalOpen(false);
      fetchSkills(); // refresh
    } catch (err) {
      addToast("Error saving skill", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await fetch(
        `https://profolionode.vanshpatel.in/api/skills/${confirmDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addToast("Deleted successfully", "success");
      setConfirmDelete(null);
      fetchSkills();
    } catch (err) {
      addToast("Error deleting", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add Skill
        </Button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <div className="flex justify-between mb-3">
              <div className="flex gap-3">
                <span className="text-2xl">{skill.icon}</span>
                <div>
                  <h3>{skill.name}</h3>
                  <p className="text-sm">{skill.category}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Edit2 onClick={() => handleOpenModal(skill)} />
                <Trash2 onClick={() => setConfirmDelete(skill.id)} />
              </div>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${skill.percentage}%` }}
              />
            </div>

            <p className="text-right mt-1">{skill.percentage}%</p>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Edit Skill" : "Add Skill"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
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
            { value: "Frontend", label: "Frontend" },
            { value: "Backend", label: "Backend" },
          ]}
        />

        <Input
          label="Icon"
          value={formData.icon}
          onChange={(e) =>
            setFormData({ ...formData, icon: e.target.value })
          }
        />
      </Modal>

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SkillsPage;