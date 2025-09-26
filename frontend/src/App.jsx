import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SoftwareList from './pages/SoftwareList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/software" element={<SoftwareList />} />
            <Route path="/categories" element={<SoftwareList />} />
            <Route path="/reviews" element={<SoftwareList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App
