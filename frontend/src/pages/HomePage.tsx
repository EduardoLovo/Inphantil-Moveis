import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Bem-vindo à Inphantil!</h1>
            <nav>
                <Link to="/login">Login</Link> |{' '}
                <Link to="/register">Cadastre-se</Link>
            </nav>
            <p>O melhor lugar para camas montessorianas.</p>
        </div>
    );
};

export default HomePage;
