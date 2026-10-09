import { Link, NavLink, Route, Routes } from "react-router-dom";
import logo from "./assets/logo.png";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import WorkPage from "./pages/WorkPage";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <div className="website">
      <header className="header">
        <div className="headerContainer">
          <Link to="/" className="brand">
            <img src={logo} alt="ShePower Foundation" />
          </Link>

          <nav className="navbar">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/work">Our Work</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <footer>
        <div className="footerContainer">
          <div className="footerColumn footerBrand">
            {/* <img src={logo} alt="ShePower Foundation" className="footerLogo" /> */}
            <p>
              ShePower Foundation is committed to empowering women and supporting
              communities through education, skill development, and sustainable support.
            </p>
            <div className="socialLinks">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="footerDivider"></div>

          <div className="footerColumn">
            <h3>Quick Links</h3>
            <div className="footerLine"></div>
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/work">Our Work</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footerDivider"></div>

          <div className="footerColumn contactColumn">
            <h3>Contact Us</h3>
            <div className="footerLine"></div>
            <div className="contactItem">
              <span className="contactIcon">☎</span>
              <p>+91 989698 1999</p>
            </div>
            <div className="contactItem">
              <span className="contactIcon">✉</span>
              <p>shepowerfoundation@gmail.com</p>
            </div>
            <div className="contactItem">
              <span className="contactIcon">📍</span>
              <p>Apex Green Apartment,<br />G-01, Sec-8, Sonipat, Haryana</p>
            </div>
          </div>

          <div className="footerDivider"></div>

          <div className="footerColumn registrationColumn">
            <h3>Registration Details</h3>
            <div className="footerLine"></div>
            <p>NITI AYOG NGO DARPAN: HR/2026/1132915</p>
            <p>CIN NO: U88900HR2026NPL147015</p>
            <p>UDYAM: UDYAM-HR-18-0072570</p>
            <Link to="/admin" className="adminFooterButton">♙ &nbsp; Admin Login</Link>
          </div>
        </div>

        <div className="copyright">
          <span>© 2026 ShePower Foundation. All Rights Reserved.</span>
          <div className="copyrightSocial">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
