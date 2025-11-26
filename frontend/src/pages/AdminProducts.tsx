import { useAuthStore } from '../store/AuthStore';
import { Link, Navigate } from 'react-router-dom';
import './AdminPage.css';
import {
    FaBox,
    FaListAlt,
    FaChartBar,
    FaPalette,
    FaCalculator,
} from 'react-icons/fa';
import { SlLogin } from 'react-icons/sl';
// Define as rotas administrativas e as permissões necessárias
interface AdminProductsCard {
    title: string;
    description: string;
    IconComponent: React.ElementType;
    link: string;
    requiredRoles: ('DEV' | 'ADMIN' | 'SELLER')[];
}

// 1. DADOS DOS CARDS (O MAPA DE FERRAMENTAS)
const ADMIN_CARDS: AdminProductsCard[] = [
    {
        title: 'Apliques',
        description: 'Criar, editar e visualizar todos Apliques.',
        IconComponent: FaBox, // Substitua por seu link Cloudinary
        link: '/admin/catalogs',
        requiredRoles: ['DEV', 'ADMIN'],
    },
    {
        title: 'Tecidos',
        description: 'Criar, editar e visualizar todos Tecidos.',
        IconComponent: FaBox, // Substitua por seu link Cloudinary
        link: '/admin/products',
        requiredRoles: ['DEV', 'ADMIN'],
    },
    {
        title: 'Sintéticos',
        description: 'Criar, editar e visualizar todos Sintéticos.',
        IconComponent: FaListAlt,
        link: '/admin/categories',
        requiredRoles: ['DEV', 'ADMIN'],
    },
];
const AdminProductsPage = () => {
    const { user } = useAuthStore();

    const currentUserRole = user?.role;

    // Garante que o usuário logado possui a role MINIMA para acessar esta página
    const canAccessPage =
        currentUserRole &&
        (currentUserRole === 'ADMIN' ||
            currentUserRole === 'DEV' ||
            currentUserRole === 'SELLER');

    // Se o usuário não tiver a permissão correta, redireciona para o Dashboard
    if (!canAccessPage) {
        return <Navigate to="/dashboard" replace />;
    }

    // 2. LÓGICA DE FILTRAGEM: Filtra os cards que o usuário tem permissão de ver
    const accessibleCards = ADMIN_CARDS.filter((card) =>
        card.requiredRoles.includes(currentUserRole)
    );

    return (
        <div className="admin-page-container">
            {' '}
            {/* Container principal */}
            <h1>Painel Administrativo</h1>
            <p>Bem-vindo(a), **{user.name}**.</p>
            <hr className="admin-divider" />
            <h2>Ferramentas de Gestão</h2>
            {/* GRID DE CARDS */}
            <div className="admin-cards-grid">
                {accessibleCards.map((card) => (
                    <Link
                        to={card.link}
                        key={card.title}
                        className="admin-card-link"
                    >
                        <div className="admin-card">
                            <card.IconComponent className="card-icon" />

                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-description">
                                {card.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            {accessibleCards.length === 0 && (
                <p>Nenhuma ferramenta disponível para o seu perfil.</p>
            )}
        </div>
    );
};

export default AdminProductsPage;
