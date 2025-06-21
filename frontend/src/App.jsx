import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import AddPage from './components/addpage';
import ViewPage from './components/viewpage';
import './navigation.css';

export default function App() {
  return (
    <div className="nav-div">
      <nav className="navbar">
        <NavLink to="/add" className="nav-link">
          Add Item Here
        </NavLink>
        <NavLink to="/view" className="nav-link">
          View Item Here
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/add" replace />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/view" element={<ViewPage />} />
      </Routes>
    </div>
  );
}
