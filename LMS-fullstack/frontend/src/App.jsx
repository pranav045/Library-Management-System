import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './AppShell.jsx'
import Home from './pages/Home.jsx'
import Users from './pages/Users.jsx'
import Authors from './pages/Authors.jsx'
import Books from './pages/Books.jsx'
import Categories from './pages/Categories.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
