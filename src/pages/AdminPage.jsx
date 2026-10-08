import { useEffect, useState } from "react";
import resolveImageUrl from "../utils/imageUrl";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [loginData, setLoginData] = useState({ username: "admin", password: "" });
  const [loginError, setLoginError] = useState("");
  const [uploadForm, setUploadForm] = useState({ title: "", note: "", type: "gallery", archive_date: "" });
  const [imageFile, setImageFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [content, setContent] = useState({ gallery: [], work: [] });
  const [showArchived, setShowArchived] = useState(false);

  const refreshContent = async () => {
    try {
      const response = await fetch("https://shefoundationbackend.onrender.com/api/content");
      if (!response.ok) {
        throw new Error("Unable to load content");
      }
      const data = await response.json();
      setContent({
        gallery: data.gallery || [],
        work: data.work || []
      });
    } catch (error) {
      setContent({ gallery: [], work: [] });
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("shepower_admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      refreshContent();
    }
  }, [isLoggedIn]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://shefoundationbackend.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("shepower_admin_token", data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      setLoginError("");
    } catch (error) {
      setLoginError(error.message || "Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("shepower_admin_token");
    setToken("");
    setIsLoggedIn(false);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!token) {
      setUploadStatus("Please login again before uploading content.");
      return;
    }

    if (!uploadForm.title || !uploadForm.note || !imageFile) {
      setUploadStatus("Please add a title, notes, and an image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("note", uploadForm.note);
    formData.append("type", uploadForm.type);
    formData.append("archive_date", uploadForm.archive_date || "");
    formData.append("image", imageFile);

    try {
      const response = await fetch("https://shefoundationbackend.onrender.com/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadStatus("Content uploaded successfully.");
      setUploadForm({ title: "", note: "", type: "gallery", archive_date: "" });
      setImageFile(null);
      await refreshContent();
    } catch (error) {
      setUploadStatus(error.message || "Upload failed. Try again.");
    }
  };

  const handleArchiveToggle = async (type, itemId, archived, archiveDate) => {
    try {
      const response = await fetch(`https://shefoundationbackend.onrender.com/api/admin/content/${type}/${itemId}/archive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          archived,
          archive_date: archived ? (archiveDate || new Date().toISOString().slice(0, 10)) : null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Archive action failed");
      }

      setUploadStatus(data.message || "Item updated.");
      await refreshContent();
    } catch (error) {
      setUploadStatus(error.message || "Archive action failed.");
    }
  };

  const handleDelete = async (type, itemId) => {
    try {
      const response = await fetch(`https://shefoundationbackend.onrender.com/api/admin/content/${type}/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setUploadStatus(data.message || "Item deleted.");
      await refreshContent();
    } catch (error) {
      setUploadStatus(error.message || "Delete failed.");
    }
  };

  const renderItems = (type) => {
    const items = (content[type] || []).filter((item) => (showArchived ? item.archived : !item.archived));

    if (items.length === 0) {
      return <p className="empty-state">No {showArchived ? "archived" : "active"} {type} items yet.</p>;
    }

    return items.map((item) => (
      <div className="manage-item" key={item.id}>
        <img src={resolveImageUrl(item.image_url)} alt={item.title} />
        <div className="manage-item-body">
          <h4>{item.title}</h4>
          <p>{item.note}</p>
          <div className="item-meta">
            <span>{item.archive_date ? `Archived: ${item.archive_date}` : "Not archived"}</span>
          </div>
          <div className="item-actions">
            <input
              type="date"
              value={item.archive_date || ""}
              onChange={(event) =>
                handleArchiveToggle(type, item.id, true, event.target.value)
              }
            />
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                handleArchiveToggle(type, item.id, showArchived ? false : true, item.archive_date || new Date().toISOString().slice(0, 10))
              }
            >
              {showArchived ? "Restore" : "Archive"}
            </button>
            <button type="button" className="primary-btn" onClick={() => handleDelete(type, item.id)}>Delete</button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="page-content narrow-page">
      <div className="section-heading">
        <p className="eyebrow">Admin Panel</p>
        <h2>Upload stories and images</h2>
      </div>

      {!isLoggedIn ? (
        <form className="form-card" onSubmit={handleLogin}>
          <label>
            Username
            <input
              type="text"
              value={loginData.username}
              onChange={(event) => setLoginData({ ...loginData, username: event.target.value })}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={loginData.password}
              onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
            />
          </label>

          {loginError && <p className="error-text">{loginError}</p>}

          <button type="submit" className="primary-btn full-width">Login</button>
        </form>
      ) : (
        <div className="form-card">
          <div className="top-row">
            <h3>Upload Content</h3>
            <button type="button" className="secondary-btn" onClick={handleLogout}>Logout</button>
          </div>

          <form className="upload-form" onSubmit={handleUpload}>
            <label>
              Title
              <input
                type="text"
                value={uploadForm.title}
                onChange={(event) => setUploadForm({ ...uploadForm, title: event.target.value })}
              />
            </label>

            <label>
              Notes
              <textarea
                rows="4"
                value={uploadForm.note}
                onChange={(event) => setUploadForm({ ...uploadForm, note: event.target.value })}
              />
            </label>

            <label>
              Show in
              <select
                value={uploadForm.type}
                onChange={(event) => setUploadForm({ ...uploadForm, type: event.target.value })}
              >
                <option value="gallery">Gallery</option>
                <option value="work">Our Work</option>
              </select>
            </label>

            <label>
              Archive Date (optional)
              <input
                type="date"
                value={uploadForm.archive_date}
                onChange={(event) => setUploadForm({ ...uploadForm, archive_date: event.target.value })}
              />
            </label>

            <label>
              Upload Image
              <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} />
            </label>

            {uploadStatus && <p className="success-text">{uploadStatus}</p>}

            <button type="submit" className="primary-btn full-width">Upload</button>
          </form>

          <div className="archive-panel">
            <div className="top-row archive-header">
              <h3>{showArchived ? "Archived Items" : "Manage Items"}</h3>
              <button type="button" className="secondary-btn" onClick={() => setShowArchived((prev) => !prev)}>
                {showArchived ? "Show Active" : "Show Archived"}
              </button>
            </div>

            <div className="section-stack">
              <div className="section-group">
                <h4>Gallery</h4>
                {renderItems("gallery")}
              </div>

              <div className="section-group">
                <h4>Our Work</h4>
                {renderItems("work")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
