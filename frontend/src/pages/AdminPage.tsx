import { useAuthStore } from '../store/AuthStore';
import { Link, Navigate } from 'react-router-dom';
import './AdminPage.css';
import {
    FaBox,
    FaListAlt,
    FaShoppingCart,
    FaChartBar,
    FaPalette,
} from 'react-icons/fa';
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
        IconComponent: FaShoppingCart,
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
];
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

    return (
        <div
            className="admin-page"
            style={{ padding: '50px', maxWidth: '1200px', margin: '0 auto' }}
        >
            <h1>Painel Administrativo</h1>
            <p>
                Bem-vindo(a), **{user.name}**. Seu perfil: **{user.role}**.
            </p>
            <hr style={{ margin: '20px 0' }} />

            <h2>Ferramentas de Gestão</h2>

            {/* GRID DE CARDS */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginTop: '30px',
                }}
            >
                {accessibleCards.map((card) => (
                    <Link
                        to={card.link}
                        key={card.title}
                        className="admin-card-link"
                    >
                        <div className="admin-card" style={CARD_STYLE}>
                            <card.IconComponent
                                size={40}
                                style={{
                                    color: '#4A90E2',
                                    marginBottom: '0px',
                                }}
                            />
                            <h3 style={{ margin: '5px 0' }}>{card.title}</h3>
                            <p style={{ fontSize: '0.9em', color: '#666' }}>
                                {card.description}
                            </p>
                            <span
                                style={{
                                    fontSize: '0.8em',
                                    color: '#007bff',
                                    marginTop: '10px',
                                }}
                            >
                                Acesso: {card.requiredRoles.join(', ')}
                            </span>
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
// Estilos básicos para o Card (pode ser movido para um arquivo CSS)
const CARD_STYLE: React.CSSProperties = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};
