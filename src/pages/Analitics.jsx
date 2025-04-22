import { useEffect, useState } from 'react'
import API from '../api/api'
import styles from './Analitics.module.css'

const Analitics = () => {
    const userId = localStorage.getItem('userId')

    const [periodsId, setPeriodsId] = useState([])
    const [selectedPeriodId, setSelectedPeriodId] = useState('')
    const [average, setAverage] = useState(null)
    const [monthlyComparison, setMonthlyComparison] = useState(null)
    const [averageMonthly, setAverageMonthly] = useState(null)

    useEffect(() => {
        const fetchPeriods = async () => {
            const allPeriodId = await API.get('/analitics/allPeriodsId', {
                params: { userId }
            })
            setPeriodsId(allPeriodId.data)
            if (allPeriodId.data.length > 0) {
                setSelectedPeriodId(allPeriodId.data[0])
            }
        }
        fetchPeriods()
    }, [])

    useEffect(() => {
        if (!selectedPeriodId) return

        const fetchAnalytics = async () => {
            try {
                const res = await API.get('/analitics/average-daily-spend', {
                    params: { userId, periodId: selectedPeriodId }
                })
                setAverage(res.data.average)

                const comparisonRes = await API.get('/analitics/monthly-comparison', {
                    params: { userId, periodId: selectedPeriodId }
                })
                setMonthlyComparison(comparisonRes.data)

                const avgMonthlyRes = await API.get('/analitics/average-monthly-expense', {
                    params: { userId }
                })
                setAverageMonthly(avgMonthlyRes.data.average)
            } catch (err) {
                console.error('Ошибка при загрузке аналитики', err)
            }
        }

        fetchAnalytics()
    }, [selectedPeriodId])

    return (
        <div className={styles.analyticsContainer}>
            <div className={styles.selectWrapper}>
                <select
                    value={selectedPeriodId}
                    onChange={(e) => setSelectedPeriodId(e.target.value)}
                >
                    {periodsId.map((periodId) => (
                        <option key={periodId} value={periodId}>
                            {periodId}
                        </option>
                    ))}
                </select>
            </div>

            {average !== null && (
                <div className={styles.analyticsBlock}>
                    <h2>Средний расход в день:</h2>
                    <p>{average.toLocaleString()}₽</p>
                </div>
            )}

            {monthlyComparison && monthlyComparison.diff !== null && (
                <div className={styles.analyticsBlock}>
                    <h2>Сравнение с прошлым месяцем:</h2>
                    <p
                        style={{
                            color: monthlyComparison.diff > 0 ? '#dc3545' : '#28a745'
                        }}
                    >
                        {monthlyComparison.diff > 0
                            ? `+${monthlyComparison.diff}% больше`
                            : `${monthlyComparison.diff}% меньше`}
                    </p>
                </div>
            )}

            {averageMonthly && (
                <div className={styles.analyticsBlock}>
                    <h2>Средняя трата за месяц:</h2>
                    <p>{Number(averageMonthly).toLocaleString()}₽</p>
                </div>
            )}
        </div>
    )

}

export default Analitics
