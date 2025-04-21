import { useEffect, useState } from 'react'
import API from '../api/api'

import styles from './History.module.css'
import Diagrams from "../components/Diagrams.jsx";

const History = () => {
    const userId = localStorage.getItem('userId')
    const [transactions, setTransactions] = useState([])
    const [budget, setBudget] = useState({ total: 0, balance: 0 })
    const [form, setForm] = useState({ category: '', amount: '', type: 'EXPENSE', note: '' })

    const getPeriodId = () => {
        const date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    }

    const fetchData = async () => {
        const periodId = getPeriodId()

        const [transRes, incomeRes] = await Promise.all([
            API.get('/transactions', { params: { userId, periodId } }),
            API.get('/income', { params: { userId, periodId } })
        ])

        const totalIncome = incomeRes.data.reduce((acc, inc) => acc + inc.amount, 0)
        const totalExpense = transRes.data
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => acc + t.amount, 0)

        setTransactions(transRes.data)
        setBudget({
            total: totalIncome,
            balance: totalIncome - totalExpense
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddTransaction = async (e) => {
        e.preventDefault()
        await API.post('/transactions', {
            userId,
            amount: parseFloat(form.amount),
            category: form.category,
            note: form.note,
            type: form.type,
            date: new Date(),
            periodId: getPeriodId()
        })

        setForm({ category: '', amount: '', type: 'EXPENSE', note: '' })
        await fetchData()
    }
    const handleDelete = async (id) => {
        if (!window.confirm('Удалить эту запись?')) return

        try {
            await API.delete(`/transactions/${id}`)
            await fetchData()
        } catch (err) {
            console.error('Ошибка при удалении транзакции:', err)
        }
    }
    return (
        <div className={styles.historyWrapper}>

            <div className={styles.topBlock}>
                <div className={styles.budgetInfo}>
                    <h3>Бюджет на месяц</h3>
                    <p>Всего: <b>{budget.total}₽</b></p>
                    <p>Осталось: <b>{budget.balance}₽</b></p>
                </div>
                <Diagrams transactions={transactions} />
            </div>


            <form className={styles.addForm} onSubmit={handleAddTransaction}>
                <select
                    className={styles.select}
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                >
                    <option value="">Выбери категорию</option>
                    <option value="Продукты">Продукты</option>
                    <option value="Транспорт">Транспорт</option>
                    <option value="Кафе">Кафе</option>
                    <option value="Одежда">Одежда</option>
                    <option value="Спорт">Спорт</option>
                    <option value="Здоровье">Здоровье</option>
                    <option value="Развлечения">Развлечения</option>
                    <option value="Коммуналка">Коммуналка</option>
                    <option value="Дом">Дом</option>
                    <option value="Долги">Долги</option>
                    <option value="Подарки">Подарки</option>
                    <option value="Другое">Другое</option>
                </select>

                <input
                    type="number"
                    className={styles.input}
                    placeholder="Сумма"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    required
                />

                <select
                    className={styles.select}
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                >
                    <option value="EXPENSE">Расход</option>
                    <option value="INCOME">Доход</option>
                </select>

                <input
                    type="text"
                    className={styles.input}
                    placeholder="Комментарий"
                    value={form.note}
                    maxLength={50}
                    onChange={(e) => setForm({...form, note: e.target.value})}
                />

                <button type="submit">Добавить</button>
            </form>


            <div className={styles.transactionList}>
                {transactions.map(tr => (
                    <div key={tr.id} className={styles.transactionItem}>
                        <span>{tr.category}</span>
                        <span className={tr.type === 'EXPENSE' ? styles.expense : styles.income}>
        {tr.type === 'EXPENSE' ? '-' : '+'}{tr.amount}₽
    </span>
                        <span>{tr.note || '—'}</span>
                        <span>{new Date(tr.date).toLocaleDateString()}</span>
                        <button onClick={() => handleDelete(tr.id)} className={styles.deleteBtn}>🗑</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default History
