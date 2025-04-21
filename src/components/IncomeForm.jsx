import { useState } from 'react'
import styles from './IncomeForm.module.css'

const IncomeForm = ({ budgetId, userId, onAdd }) => {
    const [source, setSource] = useState('')
    const [amount, setAmount] = useState('')
    const getPeriodId = () => {
        const date = new Date();
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!source || !amount) return;

        const periodId = getPeriodId();

        const res = await fetch('http://localhost:4000/income', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                budgetId,
                source,
                amount: parseFloat(amount),
                periodId
            }),
        });

        const data = await res.json();
        onAdd(data);

        setSource('');
        setAmount('');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Источник"
                value={source}
                onChange={(e) => setSource(e.target.value)}
            />
            <input
                type="number"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button type="submit">Добавить</button>
        </form>
    )
}

export default IncomeForm
