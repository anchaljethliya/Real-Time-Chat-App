import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <MainContent />
      </div>
    </Router>
  );
}

export default App;
