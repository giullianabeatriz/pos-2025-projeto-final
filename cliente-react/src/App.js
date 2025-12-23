import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Itens from "./pages/Itens";
import Categorias from "./pages/Categorias";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <h1>Sistema de Gestão</h1>
          <Link to="/" className="nav-link">Itens</Link>
          <Link to="/categorias" className="nav-link">Categorias</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Itens />} />
          <Route path="/categorias" element={<Categorias />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;