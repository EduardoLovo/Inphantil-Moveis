import { useAuthStore } from '../store/AuthStore';
import { Link, Navigate } from 'react-router-dom';
import './AdminPage.css';
import { FaBox, FaListAlt, FaChartBar, FaImage } from 'react-icons/fa';
// Define as rotas administrativas e as permissões necessárias
interface AdminCard {
    title: string;
    description: string;
    IconComponent: React.ElementType;
    link: string;
    requiredRoles: ('DEV' | 'ADMIN' | 'SELLER')[];
}

const CRIARNOVOSPRODUTOS_CARDS: AdminCard[] = [
    {
        title: 'Criar Novo Aplique',
        description: 'Calculadora para produtos sob medida, Calculadora 60/40 ',
        IconComponent: FaBox,
        link: '/admin/apliques/new',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Criar Novo Tecido',
        description: 'Calculadora para produtos sob medida, Calculadora 60/40 ',
        IconComponent: FaListAlt,
        link: '/admin/tecidos/new',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Criar Novo Sintetico',
        description: 'Calculadora para produtos sob medida, Calculadora 60/40 ',
        IconComponent: FaChartBar,
        link: '/admin/sinteticos/new',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Criar Novo Ambiente',
        description: 'Adicionar novo ambiente (Showroom) ao catálogo visual.',
        IconComponent: FaImage, // Ícone novo
        link: '/admin/ambientes/new',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
];
const PageCreateItem = () => {
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
    const accessibleCards = CRIARNOVOSPRODUTOS_CARDS.filter((card) =>
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
            <hr className="admin-divider" />
            {accessibleCards.length === 0 && (
                <p>Nenhuma ferramenta disponível para o seu perfil.</p>
            )}
        </div>
    );
};

export default PageCreateItem;
