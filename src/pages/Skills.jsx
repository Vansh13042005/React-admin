import React, { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, ChevronDown, Search, X } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import ConfirmModal from "../components/UI/ConfirmModal";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";

// ─────────────────────────────────────────────
// Tech Icon Data  (devicon CDN)
// ─────────────────────────────────────────────
const TECH_ICONS = [
  // Frontend
  { value: "html5",        label: "HTML5",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",        category: "Frontend" },
  { value: "css3",         label: "CSS3",         url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",           category: "Frontend" },
  { value: "javascript",   label: "JavaScript",   url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", category: "Frontend" },
  { value: "typescript",   label: "TypeScript",   url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", category: "Frontend" },
  { value: "react",        label: "React.js",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",          category: "Frontend" },
  { value: "nextjs",       label: "Next.js",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",        category: "Frontend" },
  { value: "vuejs",        label: "Vue.js",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",          category: "Frontend" },
  { value: "angularjs",    label: "Angular",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",  category: "Frontend" },
  { value: "svelte",       label: "Svelte",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",        category: "Frontend" },
  { value: "tailwindcss",  label: "Tailwind CSS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", category: "Frontend" },
  { value: "bootstrap",    label: "Bootstrap",    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",  category: "Frontend" },
  { value: "sass",         label: "Sass/SCSS",    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",            category: "Frontend" },
  { value: "redux",        label: "Redux",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",          category: "Frontend" },

  // Backend
  { value: "nodejs",       label: "Node.js",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",        category: "Backend" },
  { value: "express",      label: "Express.js",   url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",      category: "Backend" },
  { value: "python",       label: "Python",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",        category: "Backend" },
  { value: "django",       label: "Django",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",           category: "Backend" },
  { value: "fastapi",      label: "FastAPI",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",      category: "Backend" },
  { value: "php",          label: "PHP",          url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",              category: "Backend" },
  { value: "laravel",      label: "Laravel",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",      category: "Backend" },
  { value: "java",         label: "Java",         url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",            category: "Backend" },
  { value: "spring",       label: "Spring Boot",  url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",        category: "Backend" },
  { value: "csharp",       label: "C#",           url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",        category: "Backend" },
  { value: "dotnetcore",   label: ".NET Core",    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg", category: "Backend" },
  { value: "go",           label: "Go",           url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",                category: "Backend" },
  { value: "rust",         label: "Rust",         url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",            category: "Backend" },
  { value: "ruby",         label: "Ruby",         url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",            category: "Backend" },

  // Database
  { value: "mysql",        label: "MySQL",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",          category: "Database" },
  { value: "mongodb",      label: "MongoDB",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",      category: "Database" },
  { value: "postgresql",   label: "PostgreSQL",   url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", category: "Database" },
  { value: "redis",        label: "Redis",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",          category: "Database" },
  { value: "sqlite",       label: "SQLite",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",        category: "Database" },
  { value: "firebase",     label: "Firebase",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",       category: "Database" },
  { value: "supabase",     label: "Supabase",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",    category: "Database" },

  // Cloud & DevOps
  { value: "amazonwebservices", label: "AWS",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", category: "DevOps" },
  { value: "googlecloud",  label: "Google Cloud", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", category: "DevOps" },
  { value: "azure",        label: "Azure",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",          category: "DevOps" },
  { value: "docker",       label: "Docker",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",        category: "DevOps" },
  { value: "kubernetes",   label: "Kubernetes",   url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",   category: "DevOps" },
  { value: "nginx",        label: "Nginx",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",          category: "DevOps" },
  { value: "linux",        label: "Linux",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",          category: "DevOps" },

  // Tools
  { value: "git",          label: "Git",          url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",              category: "Tools" },
  { value: "github",       label: "GitHub",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",        category: "Tools" },
  { value: "gitlab",       label: "GitLab",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",        category: "Tools" },
  { value: "figma",        label: "Figma",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",          category: "Tools" },
  { value: "vscode",       label: "VS Code",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",        category: "Tools" },
  { value: "postman",      label: "Postman",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",      category: "Tools" },
  { value: "webpack",      label: "Webpack",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg",      category: "Tools" },
  { value: "vite",         label: "Vite",         url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg",            category: "Tools" },

  // Mobile
  { value: "flutter",      label: "Flutter",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",      category: "Mobile" },
  { value: "dart",         label: "Dart",         url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",            category: "Mobile" },
  { value: "kotlin",       label: "Kotlin",       url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",        category: "Mobile" },
  { value: "swift",        label: "Swift",        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",          category: "Mobile" },
  { value: "androidstudio",label: "Android",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg", category: "Mobile" },

  // Other
  { value: "cplusplus",    label: "C++",          url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",  category: "Other" },
  { value: "c",            label: "C",            url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",                  category: "Other" },
  { value: "graphql",      label: "GraphQL",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",         category: "Other" },
  { value: "tensorflow",   label: "TensorFlow",   url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", category: "Other" },
  { value: "pytorch",      label: "PyTorch",      url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",      category: "Other" },
  { value: "threejs",      label: "Three.js",     url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",      category: "Other" },
];

// ─────────────────────────────────────────────
// Icon Picker Component
// ─────────────────────────────────────────────
const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selected = TECH_ICONS.find((t) => t.value === value);

  const filtered = TECH_ICONS.filter(
    (t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group filtered icons by category
  const grouped = filtered.reduce((acc, icon) => {
    if (!acc[icon.category]) acc[icon.category] = [];
    acc[icon.category].push(icon);
    return acc;
  }, {});

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", marginBottom: "16px" }}>
      {/* Label */}
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "14px",
          fontWeight: 500,
          color: "#94a3b8",
        }}
      >
        Icon <span style={{ color: "#ef4444" }}>*</span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "8px",
          color: selected ? "#f1f5f9" : "#64748b",
          cursor: "pointer",
          fontSize: "14px",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = open ? "#3b82f6" : "#1e293b")
        }
      >
        {selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={selected.url}
              alt={selected.label}
              width={22}
              height={22}
              style={{ objectFit: "contain" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span>{selected.label}</span>
          </span>
        ) : (
          <span>Select a technology...</span>
        )}
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {value && (
            <X
              size={14}
              style={{ color: "#64748b" }}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            />
          )}
          <ChevronDown
            size={16}
            style={{
              color: "#64748b",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            zIndex: 9999,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Search size={14} style={{ color: "#64748b", flexShrink: 0 }} />
            <input
              autoFocus
              placeholder="Search technology..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f1f5f9",
                fontSize: "13px",
              }}
            />
          </div>

          {/* Scrollable icon list */}
          <div style={{ maxHeight: "260px", overflowY: "auto", padding: "8px 0" }}>
            {Object.keys(grouped).length === 0 ? (
              <p style={{ padding: "16px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                No results found
              </p>
            ) : (
              Object.entries(grouped).map(([category, icons]) => (
                <div key={category}>
                  <p
                    style={{
                      padding: "4px 14px 2px",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#475569",
                      margin: 0,
                    }}
                  >
                    {category}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                      gap: "2px",
                      padding: "4px 8px",
                    }}
                  >
                    {icons.map((tech) => (
                      <button
                        key={tech.value}
                        type="button"
                        onClick={() => {
                          onChange(tech.value);
                          setOpen(false);
                          setSearch("");
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 4px",
                          borderRadius: "6px",
                          border: "none",
                          background:
                            value === tech.value ? "rgba(59,130,246,0.15)" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s",
                          outline:
                            value === tech.value ? "1px solid #3b82f6" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (value !== tech.value)
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          if (value !== tech.value)
                            e.currentTarget.style.background = "transparent";
                        }}
                        title={tech.label}
                      >
                        <img
                          src={tech.url}
                          alt={tech.label}
                          width={28}
                          height={28}
                          style={{ objectFit: "contain" }}
                          onError={(e) => { e.target.style.opacity = "0.3"; }}
                        />
                        <span
                          style={{
                            fontSize: "10px",
                            color: value === tech.value ? "#93c5fd" : "#94a3b8",
                            textAlign: "center",
                            lineHeight: 1.2,
                            maxWidth: "72px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tech.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Skill Card Component
// ─────────────────────────────────────────────
const SkillCard = ({ skill, onEdit, onDelete }) => {
  const tech = TECH_ICONS.find((t) => t.value === skill.icon);

  // Color accent based on percentage
  const getColor = (pct) => {
    if (pct >= 80) return "#22c55e";
    if (pct >= 60) return "#3b82f6";
    if (pct >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor(skill.percentage);

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #1e293b, #0f172a)",
        border: "1px solid #1e293b",
        borderRadius: "14px",
        padding: "18px",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#334155";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#1e293b";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Icon */}
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {tech ? (
              <img
                src={tech.url}
                alt={tech.label}
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = `<span style="font-size:22px">${skill.icon}</span>`;
                }}
              />
            ) : (
              <span style={{ fontSize: "22px" }}>{skill.icon}</span>
            )}
          </div>

          {/* Name + Category */}
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#f1f5f9" }}>
              {skill.name}
            </h3>
            <span
              style={{
                display: "inline-block",
                marginTop: "3px",
                fontSize: "11px",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: "20px",
                background: "rgba(59,130,246,0.1)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {skill.category}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => onEdit(skill)}
            style={{
              background: "transparent",
              border: "none",
              padding: "6px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#64748b",
              transition: "color 0.2s, background 0.2s",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#3b82f6";
              e.currentTarget.style.background = "rgba(59,130,246,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(skill.id)}
            style={{
              background: "transparent",
              border: "none",
              padding: "6px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#64748b",
              transition: "color 0.2s, background 0.2s",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Proficiency</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: color }}>
            {skill.percentage}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "99px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${skill.percentage}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${color}99, ${color})`,
              borderRadius: "99px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Skills Page
// ─────────────────────────────────────────────
const SkillsPage = () => {
  const { addToast } = useToast();

  const [skills, setSkills]           = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    percentage: 50,
    icon: "",
  });

  const token = localStorage.getItem("token");

  // ─── Fetch ───────────────────────────────────
// Remove the unused Card import

const fetchSkills = useCallback(async () => {
  try {
    const res = await fetch("https://profolionode.vanshpatel.in/api/skills", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSkills(data.data || []);
  } catch (err) {
    console.log(err);
  }
}, [token]);

useEffect(() => {
  fetchSkills();
}, [fetchSkills]);

  // ─── Open Modal ───────────────────────────────
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

  // ─── Submit ───────────────────────────────────
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

      await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      addToast(editingId ? "Updated successfully" : "Added successfully", "success");
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      addToast("Error saving skill", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Delete ───────────────────────────────────
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await fetch(`https://profolionode.vanshpatel.in/api/skills/${confirmDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast("Deleted successfully", "success");
      setConfirmDelete(null);
      fetchSkills();
    } catch (err) {
      addToast("Error deleting", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Filter ───────────────────────────────────
  const categories = ["All", ...new Set(skills.map((s) => s.category).filter(Boolean))];
  const filtered =
    filterCategory === "All"
      ? skills
      : skills.filter((s) => s.category === filterCategory);

  // ─── Render ───────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#f1f5f9" }}>
            Skills
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748b" }}>
            {skills.length} skill{skills.length !== 1 ? "s" : ""} added
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Skill
        </Button>
      </div>

      {/* Category Filter Tabs */}
      {skills.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                borderColor: filterCategory === cat ? "#3b82f6" : "#1e293b",
                background: filterCategory === cat ? "rgba(59,130,246,0.15)" : "transparent",
                color: filterCategory === cat ? "#60a5fa" : "#64748b",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skills Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#475569",
            border: "1px dashed #1e293b",
            borderRadius: "14px",
          }}
        >
          <p style={{ margin: 0, fontSize: "15px" }}>No skills yet. Click "Add Skill" to get started.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={handleOpenModal}
              onDelete={(id) => setConfirmDelete(id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Edit Skill" : "Add Skill"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <Input
          label="Name *"
          placeholder="e.g. React.js"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Select
          label="Category *"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={[
            { value: "",         label: "Select category" },
            { value: "Frontend", label: "Frontend" },
            { value: "Backend",  label: "Backend" },
            { value: "Database", label: "Database" },
            { value: "DevOps",   label: "DevOps" },
            { value: "Mobile",   label: "Mobile" },
            { value: "Tools",    label: "Tools" },
            { value: "Other",    label: "Other" },
          ]}
        />

        {/* Icon Picker */}
        <IconPicker
          value={formData.icon}
          onChange={(val) => {
            const tech = TECH_ICONS.find((t) => t.value === val);
            setFormData({
              ...formData,
              icon: val,
              // Auto-fill name if empty
              name: formData.name || (tech ? tech.label : ""),
              // Auto-fill category if empty
              category: formData.category || (tech ? tech.category : ""),
            });
          }}
        />

        {/* Percentage Slider */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>
              Proficiency
            </label>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#3b82f6" }}>
              {formData.percentage}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={formData.percentage}
            onChange={(e) =>
              setFormData({ ...formData, percentage: Number(e.target.value) })
            }
            style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            {["Beginner", "Basic", "Intermediate", "Advanced", "Expert"].map(
              (label, i) => (
                <span key={label} style={{ fontSize: "10px", color: "#475569" }}>
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
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