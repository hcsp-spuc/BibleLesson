import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Elementary from './pages/Elementary'
import HighSchool from './pages/HighSchool'
import AdultCollege from './pages/AdultCollege'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import AuthGate from './pages/AuthGate'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Home />}         />
        <Route path="/lessons/1"     element={<Elementary />}   />
        <Route path="/lessons/2"     element={<HighSchool />}   />
        <Route path="/lessons/3"     element={<AdultCollege />} />
        <Route path="/quiz/:lessonId" element={<Quiz />}        />
        <Route path="/result"        element={<Result />}       />
        <Route path="/auth-gate"     element={<AuthGate />}     />
        <Route path="/dashboard"     element={<Dashboard />}    />
      </Routes>
    </BrowserRouter>
  )
}
