import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../api/api"
import styles from "./Auth.module.css"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const res = await API.post("/login", {
                email,
                password_hash: password,
            })
            localStorage.setItem("userId", res.data.userId)
            localStorage.setItem("userName", res.data.name)
            navigate("/profile")
        } catch {
            alert("Неверный логин или пароль")
        }
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Вход</h2>
            <div className={styles.form}>
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={styles.button} onClick={handleLogin}>
                    Войти
                </button>
            </div>
            <p className={styles.linkText}>
                Ещё не зарегистрированы? <Link to="/register">Создать аккаунт</Link>
            </p>
        </div>
    )
}

export default LoginPage
