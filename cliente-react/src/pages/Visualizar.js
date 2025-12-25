
import { useEffect, useState } from "react";

function Visualizar() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ITENS_URL = "http://127.0.0.1:8000/itens/";
  const CATEGORIAS_URL = "http://127.0.0.1:8000/categorias/";

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [itensRes, categoriasRes] = await Promise.all([
        fetch(ITENS_URL),
        fetch(CATEGORIAS_URL),
      ]);

      if (!itensRes.ok || !categoriasRes.ok) throw new Error("Erro ao carregar dados");

      const itensData = await itensRes.json();
      const categoriasData = await categoriasRes.json();

      setItens(itensData);
      setCategorias(categoriasData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Erro ao carregar itens e categorias");
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="page-container">
      <h2 className="page-title">Visualize todos os itens aqui</h2>

      <h3 style={{ marginTop: "20px", color: "#2563eb" }}>Itens</h3>
      <div className="cards-container">
        {itens.length === 0 && <p>Nenhum item cadastrado.</p>}
        {itens.map(item => (
          <div key={item.id} className="card">
            <h4 className="card-title">{item.nome}</h4>
            <p className="card-description">{item.descricao}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "40px", color: "#c95494" }}>Categorias</h3>
      <div className="cards-container">
        {categorias.length === 0 && <p>Nenhuma categoria cadastrada.</p>}
        {categorias.map(cat => (
          <div key={cat.id} className="card">
            <h4 className="card-title">{cat.nome}</h4>
            <p className="card-description">{cat.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Visualizar;
