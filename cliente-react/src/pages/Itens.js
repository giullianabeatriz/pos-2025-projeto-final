import { useEffect, useState } from "react";

function Itens() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome: "", descricao: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "http://127.0.0.1:8000/itens/";

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setItens(data);
        setLoading(false);
      })
      .catch(error => {
        console.log("Erro:", error);
        setError("Erro ao carregar itens");
        setLoading(false);
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

    if (!formData.nome.trim()) {
      setError("Preencha o nome do item");
      return;
    }

    if (!formData.descricao.trim()) {
      setError("Preencha a descrição do item");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro na requisição");

      setSuccess(editingId ? "Item atualizado!" : "Item criado!");
      setFormData({ nome: "", descricao: "" });
      setEditingId(null);
      setShowForm(false);
      carregarItens();
    } catch (err) {
      setError("Erro ao salvar item: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({ nome: item.nome, descricao: item.descricao });
    setEditingId(item.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este item?")) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro na requisição");

      setSuccess("Item deletado!");
      carregarItens();
    } catch (err) {
      setError("Erro ao deletar item: " + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: "", descricao: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Lista de Itens</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Adicionar Item
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="nome">Nome do Item</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome..."
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Digite a descrição..."
                className="form-input form-textarea"
                rows="4"
              />
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

      {!loading && itens.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <p className="empty-state-text">Nenhum item cadastrado ainda</p>
        </div>
      )}

      <div className="cards-container">
        {itens.map(item => (
          <div key={item.id} className="card">
            <h3 className="card-title">{item.nome}</h3>
            <p className="card-description">{item.descricao}</p>
            <div className="card-actions">
              <button
                className="btn btn-small btn-edit"
                onClick={() => handleEdit(item)}
              >
                Editar
              </button>
              <button
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(item.id)}
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

export default Itens;