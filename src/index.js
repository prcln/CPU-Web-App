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

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

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
        <h1>An Interactive, Graphical Simulator <br/>for Teaching Operating Systems</h1>
        <ul className="header">
          <li><NavLink exact to="/">Simulator</NavLink></li>
          <li><NavLink to="/project">Project</NavLink></li>
          <li><NavLink to="/notes">Notes</NavLink></li>
          <li><NavLink to="/publications">Papers</NavLink></li>
          <li><NavLink to="/video">Video</NavLink></li>
          <li><NavLink to="/download">Download</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li className="theme-toggle-li">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </li>
        </ul>
        <div className="content_plain">
          <Route exact path="/" component={Simulator}/>
          <Route path="/simulator" component={Simulator}/>
          <Route path="/project" component={Home}/>
          <Route path="/notes" component={Notes}/>
          {/* <Route path="/publications" component={Papers} loc="https://sites.google.com/a/udayton.edu/operatingsystems/publications"/> */}
          <Route path='/publications' component={() => { window.location = 'https://sites.google.com/a/udayton.edu/operatingsystems/publications'; return null;} }/>
          <Route path="/video" component={Video}/>
          <Route path="/download" component={Download}/>
          <Route path="/contact" component={Contact}/>
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