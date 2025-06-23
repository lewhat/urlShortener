import React, { useState, useEffect } from "react";
import { urlApi } from "../services/api";
import "../css/myUrls.css";
import { Redirect } from "react-router-dom";

interface Url {
  id: string;
  originalUrl: string;
  slug: string;
  createdAt: string;
  _count: {
    visits: number;
  };
}
const RedirectUrl = process.env.REACT_APP_SHORT_URL_BASE;
const MyUrls: React.FC = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await urlApi.getMyUrls();
      setUrls(response.data.data);
    } catch (error) {
      console.error("Failed to fetch URLs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (url: Url) => {
    setEditingId(url.id);
    setNewSlug(url.slug);
    setError("");
  };

  const handleUpdate = async (id: string) => {
    try {
      await urlApi.updateSlug(id, newSlug);
      await fetchUrls();
      setEditingId(null);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update slug");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewSlug("");
    setError("");
  };

  const copyToClipboard = (slug: string) => {
    const url = `${RedirectUrl}/${slug}`;
    navigator.clipboard.writeText(url);

    // Show temporary feedback
    const button = document.getElementById(`copy-${slug}`);
    if (button) {
      button.textContent = "✓ Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    }
  };

  if (loading) {
    return <div className="loading">Loading your URLs...</div>;
  }

  return (
    <div className="my-urls-container">
      <h2>My URLs</h2>

      {urls.length === 0 ? (
        <p className="no-urls">You haven't created any short URLs yet.</p>
      ) : (
        <div className="urls-list">
          {urls.map((url) => (
            <div key={url.id} className="url-item">
              <div className="url-info">
                <div className="original-url">{url.originalUrl}</div>
                <div className="short-url">
                  {editingId === url.id ? (
                    <div className="edit-slug">
                      <span>{RedirectUrl}/</span>
                      <input
                        type="text"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        className="slug-input"
                      />
                    </div>
                  ) : (
                    <a
                      href={`${RedirectUrl}/${url.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {RedirectUrl}/{url.slug}
                    </a>
                  )}
                </div>
                <div className="url-stats">
                  <span className="visits">{url._count.visits} visits</span>
                  <span className="created">
                    Created {new Date(url.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {editingId === url.id && error && (
                  <div className="error-message">{error}</div>
                )}
              </div>

              <div className="url-actions">
                {editingId === url.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(url.id)}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id={`copy-${url.slug}`}
                      onClick={() => copyToClipboard(url.slug)}
                      className="copy-btn"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleEdit(url)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUrls;
