import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await API.post("/register", {
        email,
        password_hash: password.trim(),
        name,
      });
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name);
      navigate("/profile");
    } catch (err) {
      alert("Ошибка регистрации: возможно, пользователь уже есть");
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <input
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Зарегистрироваться</button>
    </div>
  );
};

export default RegisterPage;
