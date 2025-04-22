const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const { email, password_hash, name } = req.body;
  console.log(req.body);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return res
      .status(400)
      .json({ success: false, message: "Пользователь уже существует" });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password_hash,
    },
  });

  res.json({ success: true, userId: user.id, name: user.name });
});
app.post("/login", async (req, res) => {
  const { email, password_hash } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password_hash !== password_hash) {
    return res.status(401).json({ success: false, message: "Неверные данные" });
  }

  res.json({ success: true, userId: user.id, name: user.name });
});
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) return res.status(404).json({ message: 'Пользователь не найден' })
  res.json(user)
})

app.get('/budget/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const budget = await prisma.budget.findUnique({
    where: { id }
  })

  if (!budget) return res.status(404).json({ message: 'Бюджет не найден' })
  res.json(budget)
})
app.delete("/budget/reset", async (req, res) => {
  const userId = parseInt(req.query.userId)
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Некорректный userId" })
  }

  try {

    const budgets = await prisma.budget.findMany({ where: { userId } })
    const budgetIds = budgets.map(b => b.id)

    await prisma.income.deleteMany({
      where: {
        budgetId: { in: budgetIds }
      }
    })


    await prisma.budget.deleteMany({ where: { userId } })

    res.status(200).json({ message: "Бюджет и доходы очищены" })
  } catch (err) {
    console.error("Ошибка при сбросе данных", err)
    res.status(500).json({ message: "Ошибка при сбросе данных" })
  }
})


app.get("/transactions", async (req, res) => {
  const userId = parseInt(req.query.userId);
  const transactions = await prisma.transaction.findMany({ where: { userId } });
  res.json(transactions);
});

app.post("/transactions", async (req, res) => {
  const { userId, amount, category, note, date, type, periodId } = req.body;

  if (!type || !periodId) {
    return res.status(400).json({ message: 'Поля type и periodId обязательны!' });
  }

  await prisma.transaction.create({
    data: {
      userId: Number(userId),
      amount: Number(amount),
      category,
      note,
      date: new Date(date),
      type,
      periodId
    },
  });

  res.json({ success: true });
});
app.delete('/transactions/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Неверный ID транзакции' })
  }

  try {
    await prisma.transaction.delete({ where: { id } })
    res.status(200).json({ success: true, message: 'Транзакция удалена' })
  } catch (err) {
    console.error('Ошибка при удалении транзакции:', err)
    res.status(500).json({ message: 'Ошибка при удалении транзакции' })
  }
})


app.post("/budget", async (req, res) => {
  const { userId, limitAmount } = req.body

  try {
    const newBudget = await prisma.budget.create({
      data: {
        userId: Number(userId),
        limit_amount: Number(limitAmount)
      }
    })

    res.status(201).json(newBudget)
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Ошибка при создании бюджета' })
  }
})
app.get("/budget", async (req, res) => {
  const userId = parseInt(req.query.userId)
  if (!userId) return res.status(400).json({ message: "userId обязателен" })

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId }
    })
    res.json(budgets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Ошибка при получении бюджетов" })
  }
})
app.post('/income', async (req, res) => {
  const { userId, budgetId, source, amount, periodId } = req.body;

  try {
    const income = await prisma.income.create({
      data: {
        userId: Number(userId),
        budgetId: Number(budgetId),
        source,
        amount: Number(amount),
        periodId,
      }
    });

    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        limit_amount: {
          increment: Number(amount)
        }
      }
    });

    res.status(201).json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при добавлении дохода' });
  }
});


app.get('/income', async (req, res) => {
  const { userId, periodId } = req.query;
  if (!userId || !periodId) return res.status(400).json({ message: 'userId и periodId обязательны' });

  try {
    const incomes = await prisma.income.findMany({
      where: { userId: Number(userId), periodId }
    });
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении доходов' });
  }
});

app.delete("/budget/reset", async (req, res) => {
  const userId = parseInt(req.query.userId)
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Некорректный userId" })
  }

  try {
    await prisma.income.deleteMany({ where: { userId } })
    await prisma.budget.deleteMany({ where: { userId } })

    res.status(200).json({ message: "Бюджет и доходы очищены" })
  } catch (err) {
    console.error("Ошибка при сбросе данных", err)
    res.status(500).json({ message: "Ошибка при сбросе данных" })
  }
})


app.delete('/income/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    await prisma.income.delete({ where: { id } })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка при удалении дохода' })
  }
})
app.get('/analitics/average-daily-spend', async (req, res) => {
    const {userId, periodId} = req.query;
    if (!userId || !periodId){
      return res.status(400).json({message: 'userId and periodId is important'})
    }

    try{
      const expenses = await prisma.transaction.findMany({
        where: {
          userId: Number(userId),
          periodId,
          type:"EXPENSE"
        },
      })
      const sum = expenses.reduce((acc, cur) => acc + cur.amount, 0)
      const day = new Date().getDate()
      const average = sum/day;
      res.json({average})
    }
    catch(err){
      console.error(err);
      res.status(500).json({message:'Mistake to calculate average daily spend'})
    }
})
app.get('/analitics/allPeriodsId', async (req, res) => {
  const {userId} = req.query;

  if (!userId){
    return res.status(400).json({message:'userId is important'})
  }

  try{
    const periods = await prisma.transaction.findMany({
      where: {
        userId: Number(userId)
      },
      distinct:['periodId'],
      select: {
        periodId: true
      }
    })

    const uniquePeriods = periods.map(p => p.periodId)
    res.json(uniquePeriods)
  }
  catch(err){
    console.error(err);
    res.status(500).json({message:'Mistake to get allPeriodId'})
  }
})
app.get('/analitics/monthly-comparison', async (req, res) => {
  const { userId, periodId } = req.query;
  if (!userId || !periodId) {
    return res.status(400).json({ message: 'userId и periodId обязательны' });
  }

  const [year, month] = periodId.split('-');
  const prevMonth = String(Number(month) - 1).padStart(2, '0');
  const prevPeriodId = `${year}-${prevMonth}`;

  try {
    const [currentExpenses, previousExpenses] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: Number(userId),
          periodId,
          type: 'EXPENSE'
        }
      }),
      prisma.transaction.findMany({
        where: {
          userId: Number(userId),
          periodId: prevPeriodId,
          type: 'EXPENSE'
        }
      })
    ]);

    const sum = txs => txs.reduce((acc, tx) => acc + tx.amount, 0);

    const currentTotal = sum(currentExpenses);
    const previousTotal = sum(previousExpenses);

    const diff = previousTotal === 0
        ? null
        : (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(2);

    res.json({ currentTotal, previousTotal, diff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при сравнении месяцев' });
  }
});
app.get('/analitics/average-monthly-expense', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId обязателен' });

  try {
    const expenses = await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
        type: 'EXPENSE'
      },
      select: {
        amount: true,
        periodId: true
      }
    });

    const grouped = expenses.reduce((acc, tx) => {
      if (!acc[tx.periodId]) acc[tx.periodId] = 0;
      acc[tx.periodId] += tx.amount;
      return acc;
    }, {});

    const months = Object.keys(grouped).length;
    const total = Object.values(grouped).reduce((acc, val) => acc + val, 0);
    const average = months === 0 ? 0 : (total / months).toFixed(2);

    res.json({ average });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при расчёте средней траты' });
  }
});

app.get("/", (req, res) => {
  res.send("Привет! Сервер работает.");
});

app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`),
);
