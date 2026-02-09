import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Pages where logout button should NOT appear
  const hideLogoutPages = ['/', '/login', '/signup'];
  const showLogout = !hideLogoutPages.includes(location.pathname);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/login');
  };
  return (
    <nav className='navbar'>
      {showLogout && (
        <button onClick={handleLogout} className='logout-btn'>
          Logout
        </button>
      )}
    </nav>
  );
}

export default NavBar;