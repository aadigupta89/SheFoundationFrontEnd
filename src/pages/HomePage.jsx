import foundationProfile from "../assets/foundation-profile_updated.jpeg";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-decor hero-decor-left"></div>
        <div className="hero-decor hero-decor-right"></div>
        <div className="hero-silhouette">✦</div>

        <div className="hero-copy">
          <p className="eyebrow">
            <span>ShePower FOUNDATION</span>
            <i></i>
          </p>

          <h1>
            Empowering <strong>Women</strong>
            <br />
            Inspiring <strong>Change</strong>
          </h1>

          <p className="lead">
            ShePower Foundation is committed to empowering women and supporting
            communities through education, skill development, and sustainable support.
          </p>

          <div className="button-row">
            <a className="primary-btn" href="/work">View Our Work <span>→</span></a>
          </div>

          <div className="hero-slogan">
            <span>Stronger Women</span>
            <span>Brighter Communities</span>
            <i></i>
          </div>
        </div>

        <div className="foundation-card-wrap">
          <div className="foundation-card">
            <div className="card-glow"></div>
            <img
              src={foundationProfile}
              alt="ShePower Foundation registration and contact details"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
