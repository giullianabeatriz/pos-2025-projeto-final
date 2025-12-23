function App() {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return user ? (
    <Dashboard user={user} logout={logout} />
  ) : (
    <Auth setUser={setUser} />
  );
}

/*  LOGIN / CADASTRO */

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function submit(e) {
    e.preventDefault();

    if (isLogin) {
      // LOGIN
      const saved = JSON.parse(localStorage.getItem("account"));

      if (
        saved &&
        saved.email === email &&
        saved.password === password
      ) {
        localStorage.setItem("user", JSON.stringify(saved));
        setUser(saved);
      } else {
        alert("Email ou senha inválidos");
      }
    } else {
      // CADASTRO
      const account = { email, password };
      localStorage.setItem("account", JSON.stringify(account));
      alert("Cadastro realizado com sucesso!");
      setIsLogin(true);
    }
  }

  return (
    <div className="login">
      <h1>Bem-vindo(a) ao Restaurant's</h1>
      <p>{isLogin ? "Faça seu login" : "Crie sua conta"}</p>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button>
          {isLogin ? "Entrar" : "Cadastrar"}
        </button>
      </form>

      <span
        style={{ cursor: "pointer", marginTop: "10px", display: "block" }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Não tem conta? Cadastre-se"
          : "Já tem conta? Entrar"}
      </span>
    </div>
  );
}

/*  DASHBOARD */

function Dashboard({ user, logout }) {
  return (
    <div className="dashboard">
      <header>
        <h2> Restaurant's</h2>
        <button onClick={logout}>Sair</button>
      </header>

      <main>
        <MaisPedidos />
        <CadastroPratos />
      </main>
    </div>
  );
}

/*  PRATOS MAIS PEDIDOS */

function MaisPedidos() {
  const pratos = [
    { id: 1, nome: "Feijoada", valor: 35.9 },
    { id: 2, nome: "Lasanha", valor: 29.9 },
    { id: 3, nome: "Strogonoff", valor: 27.5 }
  ];

  function detalhes(prato) {
    alert(`${prato.nome}\nR$ ${prato.valor.toFixed(2)}`);
  }

  return (
    <section>
      <h3>Pratos mais pedidos</h3>

      <div className="grid">
        {pratos.map(p => (
          <div
            key={p.id}
            className="card destaque"
            onClick={() => detalhes(p)}
          >
            <h4>{p.nome}</h4>
            <span>R$ {p.valor.toFixed(2)}</span>
            <small>Ver detalhes</small>
          </div>
        ))}
      </div>
    </section>
  );
}

/*  CRUD PRATOS */

function CadastroPratos() {
  const [pratos, setPratos] = React.useState([]);
  const [nome, setNome] = React.useState("");
  const [ingredientes, setIngredientes] = React.useState("");
  const [preparo, setPreparo] = React.useState("");
  const [valor, setValor] = React.useState("");

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pratos")) || [];
    setPratos(saved);
  }, []);

  function adicionar(e) {
    e.preventDefault();

    const novo = {
      id: Date.now(),
      nome,
      ingredientes,
      preparo,
      valor
    };

    const atualizado = [...pratos, novo];
    setPratos(atualizado);
    localStorage.setItem("pratos", JSON.stringify(atualizado));

    setNome("");
    setIngredientes("");
    setPreparo("");
    setValor("");
  }

  function remover(id) {
    const atualizado = pratos.filter(p => p.id !== id);
    setPratos(atualizado);
    localStorage.setItem("pratos", JSON.stringify(atualizado));
  }

  return (
    <section>
      <h3>Cadastro de Pratos</h3>

      <form onSubmit={adicionar} className="form">
        <input
          placeholder="Nome do prato"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Valor (R$)"
          value={valor}
          onChange={e => setValor(e.target.value)}
          required
        />

        <textarea
          placeholder="Ingredientes"
          value={ingredientes}
          onChange={e => setIngredientes(e.target.value)}
          required
        />

        <textarea
          placeholder="Modo de preparo"
          value={preparo}
          onChange={e => setPreparo(e.target.value)}
          required
        />

        <button>Adicionar prato</button>
      </form>

      <div className="grid">
        {pratos.map(p => (
          <div className="card" key={p.id}>
            <h4>{p.nome}</h4>
            <p><strong>Valor:</strong> R$ {p.valor}</p>
            <p><strong>Ingredientes:</strong><br />{p.ingredientes}</p>
            <p><strong>Preparo:</strong><br />{p.preparo}</p>
            <button onClick={() => remover(p.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);