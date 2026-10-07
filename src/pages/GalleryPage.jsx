import { useEffect, useState } from "react";
import fallbackContent from "../data/fallbackContent";
import resolveImageUrl from "../utils/imageUrl";

export default function GalleryPage() {
  const [gallery, setGallery] = useState(fallbackContent.gallery);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("https://shefoundationbackend.onrender.com/api/content");
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        const items = (data.gallery || fallbackContent.gallery).map((item) => ({
          ...item,
          archived: Boolean(item.archived)
        }));
        setGallery(items);
      } catch (error) {
        setGallery(fallbackContent.gallery);
      }
    };

    fetchGallery();
  }, []);

  const visibleItems = gallery.filter((item) => (showArchived ? item.archived : !item.archived));

  return (
    <div className="page-content">
      <div className="section-heading">
        <p className="eyebrow">Gallery</p>
        <h2>Moments from our journey</h2>
      </div>

      <div className="toggle-row">
        <button type="button" className="secondary-btn" onClick={() => setShowArchived((prev) => !prev)}>
          {showArchived ? "Show Active Gallery" : "Show Archived Gallery"}
        </button>
      </div>

      <div className="card-grid gallery-grid">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <article className="photo-card" key={item.id || item.title}>
              <img src={resolveImageUrl(item.image_url)} alt={item.title} />
              <div className="card-copy">
                <h3>{item.title}</h3>
                <p>{item.note}</p>
                {item.archive_date && <small>Archived on: {item.archive_date}</small>}
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">{showArchived ? "No archived gallery items yet." : "No gallery images yet. Please upload from the admin page."}</p>
        )}
      </div>
    </div>
  );
}
