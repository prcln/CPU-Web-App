import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { Route, NavLink, HashRouter } from "react-router-dom";

import Home from "./pages/home/Home";
import Simulator from "./pages/simulator/Simulator";
import Contact from "./pages/Contact";
import Video from "./pages/Video";
import Download from "./pages/Download";
import Notes from "./pages/Notes";
// import Papers from "./pages/Papers";

import "./index.css";

import { t, getLanguage, setLanguage } from "./language/i18n";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [langState, setLangState] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLangState(getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <HashRouter>
      <div className="content">
        <h1 dangerouslySetInnerHTML={{ __html: t("title_main") }}></h1>
        <ul className="header">
          <li><NavLink exact to="/">{t("nav_simulator")}</NavLink></li>
          <li><NavLink to="/project">{t("nav_project")}</NavLink></li>
          <li><NavLink to="/notes">{t("nav_notes")}</NavLink></li>
          <li><NavLink to="/publications">{t("nav_papers")}</NavLink></li>
          <li><NavLink to="/video">{t("nav_video")}</NavLink></li>
          <li><NavLink to="/download">{t("nav_download")}</NavLink></li>
          <li><NavLink to="/contact">{t("nav_contact")}</NavLink></li>
          <li className="theme-toggle-li">
            <button className="theme-toggle-btn" onClick={() => {
              const newLang = getLanguage() === 'vi' ? 'en' : 'vi';
              setLanguage(newLang);
            }} aria-label="Toggle Language">
              {getLanguage() === 'vi' ? "🇻🇳 VN" : "🇬🇧 EN"}
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "light" ? t("theme_dark") : t("theme_light")}
            </button>
          </li>
        </ul>
        <div className="content_plain">
          <Route exact path="/" render={(props) => <Simulator {...props} lang={langState} />} />
          <Route path="/simulator" render={(props) => <Simulator {...props} lang={langState} />} />
          <Route path="/project" component={Home} />
          <Route path="/notes" component={Notes} />
          {/* <Route path="/publications" component={Papers} loc="https://sites.google.com/a/udayton.edu/operatingsystems/publications"/> */}
          <Route path='/publications' component={() => { window.location = 'https://sites.google.com/a/udayton.edu/operatingsystems/publications'; return null; }} />
          <Route path="/video" component={Video} />
          <Route path="/download" component={Download} />
          <Route path="/contact" component={Contact} />
        </div>
      </div>
    </HashRouter>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);



// WEBPACK FOOTER //
// ./src/index.js