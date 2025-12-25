import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Itens from "./pages/Itens";
import Categorias from "./pages/Categorias";
import Visualizar from "./pages/Visualizar";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <h1>Sistema de Gestão</h1>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Itens</Link>
            <Link to="/categorias" className="nav-link" onClick={() => setMenuOpen(false)}>Categorias</Link>
            <Link to="/visualizar" className="nav-link" onClick={() => setMenuOpen(false)}>Visualizar</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Itens />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/visualizar" element={<Visualizar />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
