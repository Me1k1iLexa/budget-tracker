import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/api'
import styles from './Profile.module.css'

const Profile = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const [user, setUser] = useState(null)
  const [budgets, setBudgets] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get(`/users/${userId}`)
      setUser(res.data)
    }

    const fetchBudgets = async () => {
      const res = await API.get(`/budgets?userId=${userId}`)
      setBudgets(res.data)
    }

    fetchUser()
    fetchBudgets()
  }, [userId])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  if (!user) return <div className={styles.wrapper}>Загрузка...</div>

  return (
      <div className={styles.wrapper}>
        <div className={styles.container}>

          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user.name[0]}</div>
            <h2 className={styles.userName}>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Телефон:</strong> {user.phone || '—'}</p>
            <p><strong>Регистрация:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            <div className={styles.userButtons}>
              <button className={styles.logout} onClick={handleLogout}>Выйти</button>
              <button className={styles.edit}>Редактировать</button>
            </div>
          </div>


          <div className={styles.budgetSection}>
            <h3>Ваши бюджеты</h3>
            <div className={styles.budgetGrid}>
              {budgets.length > 0 ? budgets.map(b => (
                  <div key={b.id} className={styles.budgetCard}>
                    <p><strong>Период:</strong> {b.period}</p>
                    <p><strong>Лимит:</strong> {b.limit_amount}₽</p>
                    <p><strong>С:</strong> {new Date(b.start_date).toLocaleDateString()}</p>
                    <p><strong>По:</strong> {new Date(b.end_date).toLocaleDateString()}</p>
                  </div>
              )) : <p>Бюджеты не найдены</p>}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Profile

