import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import styles from './Diagrams.module.css'
const Diagrams = ({ transactions }) => {
    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    useEffect(() => {
        const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE')

        const categories = expenseTransactions.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount
            return acc
        }, {})

        if (chartInstance.current) {
            chartInstance.current.destroy()
        }

        const canvas = chartRef.current
        const ctx = canvas.getContext('2d')


        const pixelRatio = window.devicePixelRatio || 1
        canvas.width = canvas.offsetWidth * pixelRatio
        canvas.height = canvas.offsetHeight * pixelRatio
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

        chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        })

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy()
            }
        }
    }, [transactions])


    return (
        <div className={styles.diagramWrapper}>
        <canvas ref={chartRef}></canvas>
    </div>)

}

export default Diagrams
