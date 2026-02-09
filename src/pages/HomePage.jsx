import './HomePage.css';

import Logo from '../components/Logo'
import Button from '../components/ButtonComponent';

function HomePage() {
    return (
        <section className='landing'>
            <header className='header'>
                <Logo size={220} />
            </header>
            <div className='tagline'>
                <h3 className='tagline-1'>Take a pause — your feelings matter.</h3>
                <p className='tagline-2'>Check in, reflect, and feel supported</p>
            </div>
            <Button text={'LOGIN'} width={'52vw'} to="/login" /> 
            <Button text={'SIGNUP'} width={'52vw'} to="/signup" />

        </section >
    )
}

export default HomePage;