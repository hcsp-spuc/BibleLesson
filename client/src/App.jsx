import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import Quiz from './pages/Quiz'
import Result from './pages/Result'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Home />}    />
        <Route path="/lessons/:categoryId" element={<Lessons />} />
        <Route path="/quiz/:lessonId"    element={<Quiz />}    />
        <Route path="/result"            element={<Result />}  />
      </Routes>
    </BrowserRouter>
  )
}
