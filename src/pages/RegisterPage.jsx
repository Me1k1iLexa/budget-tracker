import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/api"
import styles from "./Auth.module.css"

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const navigate = useNavigate()

    const handleRegister = async () => {
        try {
            const res = await API.post("/register", {
                email,
                password_hash: password.trim(),
                name,
            })
            localStorage.setItem("userId", res.data.userId)
            localStorage.setItem("userName", res.data.name)
            navigate("/profile")
        } catch {
            alert("Ошибка регистрации: возможно, пользователь уже есть")
        }
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Регистрация</h2>
            <div className={styles.form}>
                <input
                    className={styles.input}
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className={styles.input}
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
                <button className={styles.button} onClick={handleRegister}>
                    Зарегистрироваться
                </button>
            </div>
        </div>
    )
}

export default RegisterPage
