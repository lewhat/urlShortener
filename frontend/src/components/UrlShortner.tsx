import React, { useState } from "react";
import { urlApi } from "../services/api";
import "../css/urlShortner.css";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
}

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortenedUrl(null);
    setLoading(true);

    try {
      const response = await urlApi.createShortUrl(
        url,
        customSlug || undefined,
      );
      setShortenedUrl(response.data.data);
      setUrl("");
      setCustomSlug("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="url-shortener">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="url"
            placeholder="Enter your URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="url-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Custom slug (optional)"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            pattern="[a-zA-Z0-9-_]+"
            className="slug-input"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {shortenedUrl && (
        <div className="result">
          <div className="shortened-url">
            <a
              href={shortenedUrl.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenedUrl.shortUrl}
            </a>
            <button onClick={copyToClipboard} className="copy-btn">
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="original-url">
            Original: {shortenedUrl.originalUrl}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
