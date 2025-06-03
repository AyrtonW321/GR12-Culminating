import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  // Settings
  

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </Router>
  )
}

export default App;
