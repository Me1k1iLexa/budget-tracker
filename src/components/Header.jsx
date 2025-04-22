import {Link, useNavigate} from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
    const isAuth = localStorage.getItem("userId") !== null

    return (

        <header className="header">
            <Link to="/" className="logo">PLAN B</Link>
            <nav className="nav">
                <Link to="/budget">БЮДЖЕТ</Link>
                <Link to="/history">ИСТОРИЯ</Link>
                <Link to="/analitics">АНАЛИЗ СЧЕТА</Link>
            </nav>
            <div className="auth-buttons">
                {isAuth ? (
                    <button className="btn btn-accent" onClick={() => navigate("/profile")}>
                        ПРОФИЛЬ
                    </button>
                ) : (
                    <>
                        <button className="btn btn-accent" onClick={() => navigate("/login")}>
                            ВОЙТИ
                        </button>
                        <button className="btn btn-accent" onClick={() => navigate("/register")}>
                            РЕГИСТРАЦИЯ
                        </button>
                    </>
                )}
            </div>
        </header>
            )
}

export default Header
