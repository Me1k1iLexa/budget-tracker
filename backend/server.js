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
  const { userId, amount, category, note, date } = req.body;
  await prisma.transaction.create({
    data: {
      userId,
      amount,
      category,
      note,
      date: new Date(date),
    },
  });
  res.json({ success: true });
});


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
  const { userId, budgetId, source, amount } = req.body

  try {
    const income = await prisma.income.create({
      data: {
        userId: Number(userId),
        budgetId: Number(budgetId),
        source,
        amount: Number(amount)
      }
    })


    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        limit_amount: {
          increment: Number(amount)
        }
      }
    })

    res.status(201).json(income)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка при добавлении дохода' })
  }
})

app.get('/income', async (req, res) => {
  const userId = parseInt(req.query.userId)
  if (!userId) return res.status(400).json({ message: 'userId обязателен' })

  try {
    const incomes = await prisma.income.findMany({
      where: { userId }
    })
    res.json(incomes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Ошибка при получении доходов' })
  }
})
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

app.get("/analytics", async (req, res) => {
  const userId = parseInt(req.query.userId);
  const list = await prisma.analytics.findMany({ where: { userId } });
  res.json(list);
});

app.post("/analytics", async (req, res) => {
  const { userId, date, total_income, total_expense } = req.body;

  await prisma.analytics.create({
    data: {
      userId,
      date: new Date(date),
      total_income,
      total_expense,
    },
  });

  res.json({ success: true });
});
app.get("/notifications", async (req, res) => {
  const userId = parseInt(req.query.userId);
  const list = await prisma.notification.findMany({ where: { userId } });
  res.json(list);
});

app.post("/notifications", async (req, res) => {
  const { userId, type, message, trigger_date } = req.body;

  await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      trigger_date: new Date(trigger_date),
    },
  });

  res.json({ success: true });
});

app.post("/notifications/read", async (req, res) => {
  const { id } = req.body;
  await prisma.notification.update({
    where: { id },
    data: { is_read: true },
  });
  res.json({ success: true });
});
app.get("/sync", async (req, res) => {
  const userId = parseInt(req.query.userId);
  const list = await prisma.syncData.findMany({ where: { userId } });
  res.json(list);
});

app.post("/sync", async (req, res) => {
  const { userId, operation_type, file_path } = req.body;

  await prisma.syncData.create({
    data: {
      userId,
      operation_type,
      file_path,
    },
  });

  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Привет! Сервер работает.");
});

app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`),
);
