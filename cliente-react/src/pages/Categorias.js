import { useEffect, useState } from "react";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ titulo: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [itensList, setItensList] = useState([]);
  const [selectedItens, setSelectedItens] = useState([]);

  const API_URL = "http://127.0.0.1:8000/categorias/";
  const ITENS_URL = "http://127.0.0.1:8000/itens/";

  useEffect(() => {
    carregarCategorias();
    carregarItens();
  }, []);

  const carregarCategorias = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Erro ao carregar categorias");
        setLoading(false);
      });
  };

  const carregarItens = () => {
    fetch(ITENS_URL)
      .then(res => res.json())
      .then(data => {
        setItensList(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.titulo.trim()) {
      setError("Preencha o título da categoria");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;
      const payload = { ...formData, itens: selectedItens };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let msg = "Erro na requisição";
        try {
          const errData = await response.json();
          msg = Object.entries(errData)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join('; ');
        } catch (_) {
          try { msg = await response.text(); } catch (_) {}
        }
        throw new Error(msg);
      }

      setSuccess(editingId ? "Categoria atualizada!" : "Categoria criada!");
      setFormData({ titulo: "" });
      setSelectedItens([]);
      setEditingId(null);
      setShowForm(false);
      carregarCategorias();
    } catch (err) {
      setError("Erro ao salvar categoria: " + err.message);
    }
  };

  const handleEdit = (categoria) => {
    setFormData({ titulo: categoria.titulo });
    setEditingId(categoria.id);
    setSelectedItens(Array.isArray(categoria.itens) ? categoria.itens : []);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta categoria?")) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro na requisição");

      setSuccess("Categoria deletada!");
      carregarCategorias();
    } catch (err) {
      setError("Erro ao deletar categoria: " + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ titulo: "" });
    setSelectedItens([]);
    setError("");
    setSuccess("");
  };

  const handleItensChange = (e) => {
    const values = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
    setSelectedItens(values);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Categorias</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Adicionar Categoria
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="titulo">Título da Categoria</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Digite o título..."
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="itens">Itens da Categoria</label>
              <select
                multiple
                id="itens"
                name="itens"
                className="form-input"
                value={selectedItens}
                onChange={handleItensChange}
              >
                {itensList.map(it => (
                  <option key={it.id} value={it.id}>{it.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? "Atualizar" : "Salvar"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading">Carregando...</div>}

      {!loading && categorias.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <p className="empty-state-text">Nenhuma categoria cadastrada ainda</p>
        </div>
      )}

      <div className="cards-container">
        {categorias.map(cat => (
          <div key={cat.id} className="card">
            <h3 className="card-title">{cat.titulo}</h3>
            <p className="card-description">
              {cat.itens?.length || 0} {cat.itens?.length === 1 ? 'item' : 'itens'}
            </p>
            <div className="card-actions">
              <button
                className="btn btn-small btn-edit"
                onClick={() => handleEdit(cat)}
              >
                Editar
              </button>
              <button
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(cat.id)}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categorias;