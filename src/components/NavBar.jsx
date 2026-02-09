import { Link, Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/use-auth.js';
import Logo from "./Logo";
import './NavBar.css';


function NavBar() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth({
            token: null,
            user: null,
        });
        navigate('/');
    };
    return (
        <>
            <div className="navbar flex space-between">
                <Logo size={220} />
                {auth.token ? 
                    (<span onClick={handleLogout} className='logout-text'>
                        Logout
                    </span>
                ):null}
            </div>
            <Outlet />
        </>
    )
}
export default NavBar;