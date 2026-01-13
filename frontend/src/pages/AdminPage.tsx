import { useAuthStore } from '../store/AuthStore';
import { Link, Navigate } from 'react-router-dom';
import './AdminPage.css';
import {
    FaBox,
    FaListAlt,
    FaChartBar,
    FaCalculator,
    FaEnvelope,
} from 'react-icons/fa';
import { SlLogin } from 'react-icons/sl';
import { FaHelmetSafety } from 'react-icons/fa6';
import { GiRolledCloth } from 'react-icons/gi';
import { RiScissorsCutLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Legend,
} from 'recharts';
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
        title: 'Logs de Login',
        description: 'Visualizar logs de acesso (sucesso e falha) do sistema.',
        IconComponent: SlLogin,
        link: '/admin/logs',
        requiredRoles: ['DEV'], // Apenas Dev (como no backend)
    },

    {
        title: 'Mensagens de Contato',
        description: 'Visualizar e-mails e dúvidas enviadas pelos clientes.',
        IconComponent: FaEnvelope,
        link: '/admin/contacts',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Protetores de Parede',
        description: 'Composições de Protetores.',
        IconComponent: FaHelmetSafety,
        link: '/composicao/protetores',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Apliques para cortar',
        description: 'Composições de Protetores.',
        IconComponent: RiScissorsCutLine,
        link: '/admin/apliques/low-stock',
        requiredRoles: ['DEV', 'ADMIN', 'SELLER'],
    },
    {
        title: 'Apliques para comprar',
        description: 'Composições de Protetores.',
        IconComponent: GiRolledCloth,
        link: '/admin/apliques/restock',
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

const USUARIOS_PEDIDOS_CARDS: AdminCard[] = [
    {
        title: 'Usuarios',
        description: 'Lista de Usuarios',
        IconComponent: FaCalculator,
        link: '/admin/users',
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
];

const AdminPage = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        dailyData: [],
        monthlyData: [],
    });

    const currentUserRole = user?.role;

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/analytics/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Erro ao buscar stats', error);
        }
    };

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

    const accessibleUsuariosPedidosCards = USUARIOS_PEDIDOS_CARDS.filter(
        (card) => card.requiredRoles.includes(currentUserRole)
    );

    return (
        <div className="admin-page-container">
            {' '}
            {/* Container principal */}
            <h1>Painel Administrativo</h1>
            <p>Bem-vindo(a), **{user.name}**.</p>
            <hr className="admin-divider" />
            {/* <h2>Usuarios e Pedidos</h2> */}
            {/* GRID DE CARDS */}
            <div className="admin-cards-grid">
                {accessibleUsuariosPedidosCards.map((card) => (
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
            <h2>Ferramentas de Gestão</h2>
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
            {/* Adicione um Card de Estatísticas */}
            <hr className="admin-divider" />
            <h2>Acessos</h2>
            <div className="card-grafic">
                <h3 style={{ marginBottom: '20px', color: '#555' }}>
                    Engajamento Recente (5 Dias)
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={stats.dailyData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            {/* BARRA 1: TOTAL DE PÁGINAS VISTAS (AZUL) */}
                            <Bar
                                name="Páginas Vistas"
                                dataKey="acessos"
                                fill="#8884d8"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />

                            {/* BARRA 2: VISITANTES ÚNICOS (VERDE) */}
                            <Bar
                                name="Visitantes Únicos"
                                dataKey="unicos"
                                fill="#82ca9d"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <h3>Visitantes</h3>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px',
                }}
            >
                {/* GRÁFICO 1: DIÁRIO (5 Dias) */}
                <div className="card-grafic">
                    <h3 style={{ marginBottom: '20px', color: '#555' }}>
                        Engajamento Recente (5 Dias)
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={stats.dailyData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />

                                <Bar
                                    name="Visitantes Únicos"
                                    dataKey="unicos"
                                    fill="#82ca9d"
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRÁFICO 2: MENSAL (Ano Atual) */}
                <div className="card-grafic">
                    <h3 style={{ marginBottom: '20px', color: '#555' }}>
                        Desempenho no Ano ({new Date().getFullYear()})
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart
                                data={stats.monthlyData}
                                margin={{
                                    top: 20,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    fontSize={12}
                                    tick={{ dy: 5 }}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />

                                <Area
                                    name="Visitantes Únicos"
                                    type="monotone"
                                    dataKey="unicos"
                                    stroke="#82ca9d"
                                    fill="#82ca9d"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <h3>Paginas Vistas</h3>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '40px',
                }}
            >
                {/* Gráfico 1: Últimos 5 Dias (Barras) */}
                <div className="card-grafic">
                    <h3 style={{ marginBottom: '20px', color: '#555' }}>
                        Acessos Recentes (5 Dias)
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.dailyData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                />
                                <Bar
                                    dataKey="acessos"
                                    fill="#8884d8"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico 2: Mensal (Área/Linha) */}
                <div className="card-grafic">
                    <h3 style={{ marginBottom: '20px', color: '#555' }}>
                        Acessos por Mês ({new Date().getFullYear()})
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats.monthlyData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    fontSize={12}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="acessos"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            {accessibleCards.length === 0 && (
                <p>Nenhuma ferramenta disponível para o seu perfil.</p>
            )}
        </div>
    );
};

export default AdminPage;
