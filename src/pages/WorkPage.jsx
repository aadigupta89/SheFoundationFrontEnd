import { useEffect, useState } from "react";
import fallbackContent from "../data/fallbackContent";
import resolveImageUrl from "../utils/imageUrl";

export default function WorkPage() {
  const [workItems, setWorkItems] = useState(fallbackContent.work);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch("https://shefoundationbackend.onrender.com/api/content");
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        const items = (data.work?.length ? data.work : fallbackContent.work).map((item) => ({
          ...item,
          archived: Boolean(item.archived)
        }));
        setWorkItems(items);
      } catch (error) {
        setWorkItems(fallbackContent.work);
      }
    };

    fetchWork();
  }, []);

  const visibleItems = workItems.filter((item) => (showArchived ? item.archived : !item.archived));

  return (
    <div className="page-content">
      <div className="section-heading">
        <p className="eyebrow">Our Work</p>
        <h2>Programs and impact stories</h2>
      </div>

      <div className="toggle-row">
        <button type="button" className="secondary-btn" onClick={() => setShowArchived((prev) => !prev)}>
          {showArchived ? "Show Active Work" : "Show Archived Work"}
        </button>
      </div>

      <div className="card-grid work-grid">
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
          <p className="empty-state">{showArchived ? "No archived work posts yet." : "No work posts yet. Please upload from the admin page."}</p>
        )}
      </div>
    </div>
  );
}
