import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/api'
import styles from './Profile.module.css'
const formatDate = (date) =>
    date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
const Profile = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const [user, setUser] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
  const [expenses, setExpenses] = useState(0);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get(`/users/${userId}`)
      setUser(res.data)
    }

    const fetchBudgets = async () => {
      const res = await API.get(`/budget?userId=${userId}`)
      setBudgets(res.data)
    }
    const fetchExpenses = async () => {
      const now = new Date();
      const periodId = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

      const res = await API.get('/transactions', { params: { userId } });
      const expensesForPeriod = res.data
          .filter(t => t.type === "EXPENSE" && t.periodId === periodId)
          .reduce((sum, t) => sum + t.amount, 0);

      setExpenses(expensesForPeriod);
    }

    fetchExpenses();
    fetchUser();
    fetchBudgets();
  }, [userId])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }
  const startEdit = () => {
    setEditData({ name: user.name, email: user.email, phone: user.phone || '' });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await API.put(`/users/${userId}`, editData);
      setUser(prev => ({ ...prev, ...editData }));
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка при сохранении профиля', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };
  if (!user) return <div className={styles.wrapper}>Загрузка...</div>

  return (
      <div className={styles.wrapper}>
        <div className={styles.container}>

          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user.name[0]}</div>
            {isEditing ? (
                <>
                  <input name="name" value={editData.name} onChange={handleChange}/>
                  <input name="email" value={editData.email} onChange={handleChange}/>
                  <input name="phone" value={editData.phone} onChange={handleChange}/>
                </>
            ) : (
                <>
                  <h2 className={styles.userName}>{user.name}</h2>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Телефон:</strong> {user.phone || '—'}</p>
                  <p><strong>Регистрация:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                </>
            )}

            <div className={styles.userButtons}>
              {isEditing ? (
                  <button className={styles.logout} onClick={handleSave}>Сохранить</button>
              ) : (
                  <>
                    <button className={styles.logout} onClick={handleLogout}>Выйти</button>
                    <button className={styles.edit} onClick={startEdit}>Редактировать</button>
                  </>
              )}
            </div>
          </div>


          <div className={styles.budgetSection}>
            <h3>Ваш бюджет</h3>
            <div className={styles.budgetGrid}>
              {budgets.length > 0 ? budgets.map(b => {
                const now = new Date()
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
                const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

                const remaining = b.limit_amount - expenses

                return (
                    <div key={b.id} className={styles.budgetCard}>
                      <p><strong>Лимит:</strong> {b.limit_amount.toLocaleString('ru-RU')}₽</p>
                      <p><strong>Период:</strong> {formatDate(startOfMonth)} — {formatDate(startOfNextMonth)}</p>
                      <p><strong>Остаток:</strong> {remaining.toLocaleString('ru-RU')}₽</p>
                    </div>
                )
              }) : <p>Бюджеты не найдены</p>}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Profile

