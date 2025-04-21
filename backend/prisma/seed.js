const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const dayjs = require('dayjs')

async function main() {
    const now = new Date()
    const periodId = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`

    const user = await prisma.user.create({
        data: {
            email: 'test@planb.ru',
            password_hash: 'hashed123',
            name: 'Test User',
            created_at: now
        }
    })

    const budget = await prisma.budget.create({
        data: {
            userId: user.id,
            limit_amount: 100000,
            createdAt: now
        }
    })

    const sources = ['Зарплата', 'Фриланс', 'Подарок']
    for (const src of sources) {
        await prisma.income.create({
            data: {
                userId: user.id,
                budgetId: budget.id,
                source: src,
                amount: Math.floor(Math.random() * 30000 + 10000),
                periodId,
                createdAt: now
            }
        })
    }

    const categories = ['Продукты', 'Транспорт', 'Кафе', 'Одежда', 'Спорт', 'Хобби']
    for (let i = 0; i < 30; i++) {
        await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: Math.floor(Math.random() * 5000 + 500),
                category: categories[Math.floor(Math.random() * categories.length)],
                note: ['Купил кофе', 'Бензин', 'Тренировка', 'Случайно'][Math.floor(Math.random() * 4)],
                date: dayjs(now).subtract(Math.floor(Math.random() * 30), 'day').toDate(),
                type: Math.random() < 0.8 ? 'EXPENSE' : 'INCOME',
                periodId
            }
        })
    }

    console.log('✅ База успешно заполнена')
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
