import { useEffect, useState } from "react";

function Itens() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/itens/")
      .then(response => response.json())
      .then(data => {
        setItens(data);
        setLoading(false);
      })
      .catch(error => {
        console.log("Erro:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">Lista de Itens</h2>
      
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Itens;