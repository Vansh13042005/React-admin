import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Upload,
  Trash2,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const API = "https://profolionode.vanshpatel.in/api/resume";

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ResumePage = () => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [resume, setResume]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  // Form state
  const [title, setTitle]     = useState("");
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  // ── Fetch current resume ────────────────────────────────────────────────
  const fetchResume = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ inside callback, not a dep
      });
      const data = await res.json();
      const item = Array.isArray(data.data) ? data.data[0] : data.data;
      setResume(item || null);
    } catch {
      setResume(null);
    } finally {
      setLoading(false);
    }
  }, [token]); // ✅ only token as dep — stable primitive

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  // ── File selection ──────────────────────────────────────────────────────
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      addToast("Only PDF files are allowed", "error");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      addToast("File size must be under 5 MB", "error");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    if (!title) setTitle(selectedFile.name.replace(".pdf", ""));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  // ── Upload ──────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) { addToast("Please select a PDF file", "error"); return; }
    if (!title.trim()) { addToast("Please enter a title", "error"); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("resume", file);

      const res = await fetch(API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // ✅ inline here too
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      addToast("Resume uploaded successfully", "success");

      setFile(null);
      setPreview(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchResume();
    } catch {
      addToast("Error uploading resume", "error");
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!resume) return;
    if (!window.confirm("Are you sure you want to delete the current resume?")) return;

    setDeleting(true);
    try {
      await fetch(`${API}/${resume.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }, // ✅ inline here too
      });
      addToast("Resume deleted", "success");
      setResume(null);
    } catch {
      addToast("Error deleting resume", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload your CV / Resume (PDF only, max 5 MB)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── LEFT: Upload Form ─────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 dark:text-white text-lg flex items-center gap-2">
            <Upload size={18} className="text-blue-500" />
            Upload New Resume
          </h3>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vansh Patel - Full Stack Developer"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all
              ${dragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                : file
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle size={36} className="text-green-500" />
                <p className="font-medium text-green-700 dark:text-green-400 text-sm">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                <p className="text-xs text-gray-400 mt-1">Click to change file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                  <FileText size={26} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag &amp; drop your PDF here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                  PDF • Max 5 MB
                </span>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all
              ${uploading || !file
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }
            `}
          >
            {uploading ? (
              <><Loader2 size={18} className="animate-spin" /> Uploading...</>
            ) : (
              <><Upload size={18} /> Upload Resume</>
            )}
          </button>
        </div>

        {/* ── RIGHT: Current Resume ─────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white text-lg flex items-center gap-2 mb-5">
            <FileText size={18} className="text-purple-500" />
            Current Resume
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <Loader2 size={28} className="animate-spin text-blue-500" />
              <p className="text-sm text-gray-400">Loading resume...</p>
            </div>
          ) : resume ? (
            <div className="space-y-5">
              {/* Info Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {resume.title || "Resume"}
                  </p>
                  {resume.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded on {formatDate(resume.createdAt)}
                    </p>
                  )}
                  {resume.size && (
                    <p className="text-xs text-gray-400">{formatBytes(resume.size)}</p>
                  )}
                </div>
              </div>

              {/* PDF Preview (iframe) */}
              {resume.url && (
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                  <iframe
                    src={resume.url}
                    title="Resume Preview"
                    className="w-full"
                    style={{ height: "320px" }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {resume.url && (
                  <>
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                    >
                      <Eye size={16} /> View
                    </a>
                    <a
                      href={resume.url}
                      download
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-500 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-950/30 transition"
                    >
                      <Download size={16} /> Download
                    </a>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-400 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                >
                  {deleting
                    ? <><Loader2 size={15} className="animate-spin" /> Deleting...</>
                    : <><Trash2 size={15} /> Delete</>
                  }
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <AlertCircle size={36} className="text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No resume uploaded yet
              </p>
              <p className="text-xs text-gray-400">
                Upload a PDF from the left panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Local PDF Preview (before upload) ──────────────────────────── */}
      {preview && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Eye size={17} className="text-green-500" />
            Preview — {file?.name}
          </h3>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <iframe
              src={preview}
              title="PDF Preview"
              className="w-full"
              style={{ height: "480px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePage;