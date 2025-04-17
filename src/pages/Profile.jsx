import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/api'
import styles from './Profile.module.css'

const Profile = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const [user, setUser] = useState(null)
  const [monthlySpent, setMonthlySpent] = useState(0)
  const [activeBudget, setActiveBudget] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get(`/users/${userId}`)
      setUser(res.data)
    }

    const fetchTransactions = async () => {
      const res = await API.get(`/transactions?userId=${userId}`)
      const thisMonth = new Date().getMonth()
      const total = res.data
          .filter(t => new Date(t.date).getMonth() === thisMonth)
          .reduce((acc, curr) => acc + curr.amount, 0)
      setMonthlySpent(total)
    }

    const fetchBudget = async () => {
      const res = await API.get(`/budgets?userId=${userId}`)
      const active = res.data[0] // допустим, пока первый — активный
      setActiveBudget(active)
    }

    fetchUser()
    fetchTransactions()
    fetchBudget()
  }, [userId])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  if (!user) return <div className={styles.wrapper}>Загрузка...</div>

  return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Профиль</h1>
          <button className="btn" onClick={handleLogout}>Выйти</button>
        </div>

        <div className={styles.infoBlock}>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Телефон:</strong> {user.phone || '—'}</p>
          <p><strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          <hr />
          <p><strong>Активный бюджет:</strong> {activeBudget ? `${activeBudget.limit_amount}₽` : '—'}</p>
          <p><strong>Потрачено в этом месяце:</strong> {monthlySpent}₽</p>
        </div>

        <p className={styles.note}>Редактирование профиля пока недоступно</p>
      </div>
  )
}

export default Profile;
