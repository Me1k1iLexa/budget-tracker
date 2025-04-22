//seed сделан нейросетью O_o

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');

const MONTHS = [
    '2024-05', '2024-06', '2024-07', '2024-08',
    '2024-09', '2024-10', '2024-11', '2024-12',
    '2025-01', '2025-02', '2025-03', '2025-04'
];

const CATEGORIES = ['Продукты', 'Одежда', 'Транспорт', 'Кафе', 'Развлечения'];
const SOURCES = ['Зарплата', 'Фриланс', 'Подарок', 'Бонус'];

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
    for (let i = 1; i <= 5; i++) {
        const user = await prisma.user.create({
            data: {
                email: `user${i}@test.com`,
                password_hash: '123',
                name: `User ${i}`,
                created_at: new Date()
            }
        });

        const budget = await prisma.budget.create({
            data: {
                userId: user.id,
                limit_amount: getRandom(50000, 150000),
                createdAt: new Date()
            }
        });

        for (const periodId of MONTHS) {
            const monthlyIncome = [];
            let incomeSum = 0;

            // создаём 2-3 источника дохода
            const incomeCount = getRandom(2, 3);
            for (let j = 0; j < incomeCount; j++) {
                const amount = getRandom(15000, 40000);
                incomeSum += amount;

                await prisma.income.create({
                    data: {
                        userId: user.id,
                        budgetId: budget.id,
                        source: SOURCES[j % SOURCES.length],
                        amount,
                        createdAt: new Date(),
                        periodId
                    }
                });
            }

            let totalSpent = 0;
            let k = 0;
            // создаём траты, пока они не превысят доход
            while (totalSpent < incomeSum * 0.9 && k < 20) {
                const amount = getRandom(1000, 7000);
                if (totalSpent + amount > incomeSum) break;

                await prisma.transaction.create({
                    data: {
                        userId: user.id,
                        amount,
                        category: CATEGORIES[getRandom(0, CATEGORIES.length - 1)],
                        note: 'Авто сида',
                        date: dayjs(`${periodId}-10`).add(getRandom(0, 20), 'day').toDate(),
                        type: 'EXPENSE',
                        periodId
                    }
                });

                totalSpent += amount;
                k++;
            }
        }
    }

    console.log(' База готова');
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });


