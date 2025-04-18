import { useEffect, useState } from 'react'
import API from '../api/api'
import styles from './BudgetPanel.module.css'
import IncomeForm from './IncomeForm'
import BudgetForm from './BudgetForm'

const BudgetPanel = () => {
    const userId = localStorage.getItem('userId')
    const [budget, setBudget] = useState(null)
    const [incomes, setIncomes] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBudget = async () => {
        const res = await API.get(`/budget?userId=${userId}`)
        setBudget(res.data[0] || null)
        setLoading(false)
    }

    const fetchIncomes = async () => {
        const res = await API.get(`/income`, { params: { userId } })
        setIncomes(res.data)
    }

    useEffect(() => {
        fetchBudget()
        fetchIncomes()
    }, [])

    const handleAddIncome = async () => {
        await fetchIncomes()
        await fetchBudget()
    }


    const handleBudgetCreated = async () => {
        await fetchBudget()
        await fetchIncomes()
    }
    const handleReset = async () => {
        console.log('userId из localStorage:', localStorage.getItem('userId'))
        try {
            await API.delete(`/budget/reset`, { params: { userId: Number(userId) } })

            setBudget(null)
            setIncomes([])
        } catch (err) {
            console.error("Ошибка при сбросе бюджета", err)
        }
    }

    if (loading) return <p>Загрузка...</p>


    if (!budget) {
        return (
            <div className={styles.wrapper}>
                <h2>Создание бюджета</h2>
                <p>Добавь свои доходы для старта</p>
                <BudgetForm userId={userId} onBudgetCreated={handleBudgetCreated} />
            </div>
        )
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.budgetCard}>
                <h3>Текущий бюджет</h3>
                <p><strong>Лимит:</strong> {budget.limit_amount}₽</p>
                <p><strong>Создан:</strong> {new Date(budget.createdAt).toLocaleDateString()}</p>

                <h4>Доходы:</h4>
                {incomes.filter(i => i.budgetId === budget.id).map(i => (
                    <p key={i.id}>💼 {i.source}: {i.amount}₽</p>
                ))}

                <IncomeForm
                    userId={userId}
                    budgetId={budget.id}
                    onAdd={handleAddIncome}
                />
            </div>
            <button className={styles.resetButton} onClick={handleReset}>
                Пересоздать бюджет
            </button>
        </div>
    )
}

export default BudgetPanel
