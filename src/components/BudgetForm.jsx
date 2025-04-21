import { useState } from 'react'
import styles from './BudgetForm.module.css'
import API from '../api/api'

const BudgetForm = ({ userId, onBudgetCreated }) => {
    const [incomes, setIncomes] = useState([{ source: '', amount: '' }])

    const handleChange = (index, field, value) => {
        const updated = [...incomes]
        updated[index][field] = value
        setIncomes(updated)
    }

    const addField = () => {
        setIncomes([...incomes, { source: '', amount: '' }])
    }
    const getPeriodId = () => {
        const date = new Date();
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = incomes.filter(i => i.source && i.amount);
        if (valid.length === 0) return;

        const periodId = getPeriodId();

        const budgetRes = await API.post('/budget', {
            userId,
            limitAmount: 0
        });

        const budget = budgetRes.data;

        for (const income of valid) {
            await API.post('/income', {
                userId,
                budgetId: budget.id,
                source: income.source,
                amount: parseFloat(income.amount),
                periodId
            });
        }

        onBudgetCreated();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3>Добавь свои источники дохода</h3>

            {incomes.map((income, index) => (
                <div key={index} className={styles.row}>
                    <input
                        type="text"
                        placeholder="Источник"
                        value={income.source}
                        onChange={(e) => handleChange(index, 'source', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Сумма (₽)"
                        value={income.amount}
                        onChange={(e) => handleChange(index, 'amount', e.target.value)}
                    />
                </div>
            ))}

            <button type="button" className="main-style-button" onClick={addField}>
                Добавить источник
            </button>

            <button type="submit" className={`main-style-button ${styles.submit}`}>
                Создать бюджет
            </button>
        </form>
    )
}

export default BudgetForm
