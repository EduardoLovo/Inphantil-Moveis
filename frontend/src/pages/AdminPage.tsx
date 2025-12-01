import { useAuthStore } from '../store/AuthStore';
import { Link, Navigate } from 'react-router-dom';
import './AdminPage.css';
import {
    FaBox,
    FaListAlt,
    FaChartBar,
    FaPalette,
    FaCalculator,
    FaEnvelope,
} from 'react-icons/fa';
import { SlLogin } from 'react-icons/sl';
// Define as rotas administrativas e as permissões necessárias
interface AdminCard {
    title: string;
    description: string;
    IconComponent: React.ElementType;
    link: string;
    requiredRoles: ('DEV' | 'ADMIN' | 'SELLER')[];
}

// 1. DADOS DOS CARDS (O MAPA DE FERRAMENTAS)
const ADMIN_CARDS: AdminCard[] = [
    {
        title: 'Gerenciar Catálogos',
        description: 'Criar, editar e visualizar todos os catálogos.',
        IconComponent: FaBox, // Substitua por seu link Cloudinary
        link: '/admin/create/item',
        requiredRoles: ['DEV', 'ADMIN'],
    },
    {
        title: 'Gerenciar Produtos',
        description: 'Criar, editar e visualizar todos os produtos de venda.',
        IconComponent: FaBox, // Substitua por seu link Cloudinary
        link: '/admin/products',
        requiredRoles: ['DEV', 'ADMIN'],
    },
    {
        title: 'Gerenciar Categorias',
        description: 'Adicionar e atualizar categorias do catálogo.',
        IconComponent: FaListAlt,
        link: '/admin/categories',
        requiredRoles: ['DEV', 'ADMIN'],
    },
    {
        title: 'Gerenciar Pedidos',
        description:
            'Visualizar todos os pedidos do sistema e alterar status (Produção, Envio, Pago).',
        IconComponent: FaChartBar,
        link: '/admin/orders',
        requiredRoles: ['DEV', 'ADMIN'],
    },
    {
        title: 'Logs de Login',
        description: 'Visualizar logs de acesso (sucesso e falha) do sistema.',
        IconComponent: SlLogin,
        link: '/admin/logs',
        requiredRoles: ['DEV'], // Apenas Dev (como no backend)
    },
    {
        title: 'Catálogo de Demonstração (Visual)',
        description:
            'Gerenciar apliques, tecidos e itens visuais para o catálogo.',
        IconComponent: FaPalette,
        link: '/admin/visuals',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Mensagens de Contato',
        description: 'Visualizar e-mails e dúvidas enviadas pelos clientes.',
        IconComponent: FaEnvelope,
        link: '/admin/contacts',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
];

const CALCULADORAS_CARDS: AdminCard[] = [
    {
        title: 'Calculadora Cama Sob Medida',
        description: 'Calculadora para produtos sob medida, Calculadora 60/40 ',
        IconComponent: FaCalculator,
        link: '/calculadora-cama-sob-medida',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Calculadora Colchão do Cliente',
        description: 'Calculadora para produtos sob medida, Calculadora 60/40 ',
        IconComponent: FaCalculator,
        link: '/calculadora-medida-do-colchao',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Calculadora 6040',
        description: 'Calculadora para produtos sob medida, Calculadora 60/40 ',
        IconComponent: FaCalculator,
        link: '/calculadora-6040',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
];

// const CRIARNOVOSPRODUTOS_CARDS: AdminCard[] = [
//     {
//         title: 'Calculadora Cama Sob Medida',
//         description: 'Calculadora para produtos sob medida, Calculadora 60/40 ',
//         IconComponent: FaCalculator,
//         link: '/calculadora-cama-sob-medida',
//         requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
//     },
// ];
const AdminPage = () => {
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

    const accessibleCalculadorasCards = CALCULADORAS_CARDS.filter((card) =>
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
            <h2>Calculadoras</h2>
            <div className="admin-cards-grid">
                {accessibleCalculadorasCards.map((card) => (
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

export default AdminPage;
