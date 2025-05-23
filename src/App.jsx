import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Profile from './pages/Profile'
import BudgetPanel from "./pages/BudgetPanel.jsx";
import History from "./pages/History.jsx";
import Analitics from "./pages/Analitics.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'profile', element: <Profile /> },
            { path: 'budget', element: <BudgetPanel /> },
            { path: 'history', element: <History/>},
            {path:'analitics',element:<Analitics/>}
        ]
    }
])

function App() {
    return <RouterProvider router={router} />
}

export default App
