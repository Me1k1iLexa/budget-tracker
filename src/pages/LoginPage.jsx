import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", {
        email,
        password_hash: password.toString(),
      });
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name);
      navigate("/profile");
    } catch (err) {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <button onClick={handleLogin}>Войти</button>
      <p>
        Ещё не зарегистрированы? <Link to="/register">Создать аккаунт</Link>
      </p>
    </div>
  );
};

export default LoginPage;
