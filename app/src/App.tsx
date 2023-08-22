import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthButton from './component/GoogleFitSteps'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<AuthButton />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
