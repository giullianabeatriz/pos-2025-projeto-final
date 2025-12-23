import { useEffect, useState } from "react";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/categorias/")
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">Categorias</h2>
      
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categorias;