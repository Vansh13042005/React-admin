import React, { useEffect, useState } from "react";

const API = "https://profolionode.vanshpatel.in/api/education";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [form, setForm] = useState({
    degree: "",
    institution: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  // 🔥 FETCH
  const fetchEducation = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setEducation(data.data);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      degree: "",
      institution: "",
      start_date: "",
      end_date: "",
      description: "",
    });

    setEditId(null);
    fetchEducation();
  };

  // 🔥 EDIT
  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchEducation();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Education</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-4 mb-8">
        <input name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded" />
        <input name="institution" placeholder="Institution" value={form.institution} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded" />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded" />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded" />

        <button className="bg-indigo-600 py-3 rounded">
          {editId ? "Update" : "Add"} Education
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">{edu.degree}</h3>
              <p className="text-sm text-gray-400">{edu.institution}</p>
              <p className="text-sm text-gray-500">
                {new Date(edu.start_date).getFullYear()} -{" "}
                {edu.end_date
                  ? new Date(edu.end_date).getFullYear()
                  : "Present"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(edu)}
                className="px-3 py-1 bg-yellow-500 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="px-3 py-1 bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;