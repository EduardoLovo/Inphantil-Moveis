import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { api } from "../../services/api";
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
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  FaSpinner,
  FaUsers,
  FaMoneyBillWave,
  FaCreditCard,
  FaPix,
} from "react-icons/fa6"; // Usando fa6 para ter o ícone do Pix (se der erro, pode trocar pro FaMoneyBill)

const AdminPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    dailyData: [],
    totals: {
      revenue: 0,
      revenuePix: 0,
      revenueCartao: 0,
      orders: 0,
      visits: 0,
    },
  });

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const response = await api.get("/orders/admin/all");
        const orders = response.data;

        const mockTrafficFactor = 15;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Prepara os últimos 7 dias com as caixinhas separadas
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - (6 - i));
          return {
            dateStr: d.toISOString().split("T")[0],
            name: d.toLocaleDateString("pt-BR", { weekday: "short" }),
            pedidos: 0,
            receitaTotal: 0,
            receitaPix: 0,
            receitaCartao: 0,
            visitas: 0,
          };
        });

        let totalRevenue = 0;
        let totalPix = 0;
        let totalCartao = 0;
        let totalOrders = 0;

        // 2. Processa os pedidos e separa o dinheiro
        orders.forEach((order: any) => {
          console.log(
            `Pedido ${order.id} - Pagamento: "${order.paymentMethod}" - Status: ${order.status}`,
          );
          if (order.status === "CANCELED") return;

          const orderTotal = Number(order.total) || 0;
          const pm = order.paymentMethod?.toLowerCase() || "";

          // Descobre a forma de pagamento
          // 🕵️‍♂️ LOG ESPIÃO: Isso vai imprimir no terminal do navegador qual é a palavra exata
          console.log(
            `Pedido ${order.id} - Pagamento: "${order.paymentMethod}" - Status: ${order.status}`,
          );

          // Descobre a forma de pagamento (Agora mais inteligente, buscando com acento e a palavra "card")
          const isPix = pm === "pix";
          const isCartao =
            pm.includes("credit") ||
            pm.includes("cartao") ||
            pm.includes("cartão") ||
            pm.includes("card");

          // Soma nos totais gerais
          totalRevenue += orderTotal;
          if (isPix) totalPix += orderTotal;
          if (isCartao) totalCartao += orderTotal;
          totalOrders += 1;

          const orderDateStr = new Date(order.createdAt)
            .toISOString()
            .split("T")[0];
          const dayIndex = last7Days.findIndex(
            (d) => d.dateStr === orderDateStr,
          );

          // Soma nos dias específicos para o gráfico
          if (dayIndex !== -1) {
            last7Days[dayIndex].pedidos += 1;
            last7Days[dayIndex].receitaTotal += orderTotal;
            if (isPix) last7Days[dayIndex].receitaPix += orderTotal;
            if (isCartao) last7Days[dayIndex].receitaCartao += orderTotal;

            last7Days[dayIndex].visitas =
              last7Days[dayIndex].pedidos * mockTrafficFactor +
              Math.floor(Math.random() * 20);
          }
        });

        setStats({
          dailyData: last7Days as any,
          totals: {
            revenue: totalRevenue,
            revenuePix: totalPix,
            revenueCartao: totalCartao,
            orders: totalOrders,
            visits: totalOrders * mockTrafficFactor + 450,
          },
        });
      } catch (error) {
        console.error("Erro ao processar dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-8 pb-16">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Executivo
        </h1>
        <p className="text-gray-500">
          Olá, <span className="font-semibold text-blue-600">{user?.name}</span>
          . Aqui está o resumo da sua loja.
        </p>
      </header>

      {/* --- CARDS DE RESUMO RÁPIDO --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl">
            <FaMoneyBillWave />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">
              Receita Total
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {formatCurrency(stats.totals.revenue)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-xl">
            <FaPix />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">
              Receita Pix
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {formatCurrency(stats.totals.revenuePix)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            <FaCreditCard />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">
              Receita Cartão
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {formatCurrency(stats.totals.revenueCartao)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center text-xl">
            {/* <FaShoppingCart /> */}s
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">
              Pedidos Pagos
            </p>
            <h3 className="text-xl font-bold text-gray-800">
              {stats.totals.orders}
            </h3>
          </div>
        </div>
      </div>

      {/* --- GRÁFICOS FINANCEIROS --- */}
      <section className="space-y-6">
        {/* GRÁFICO 1: OS DOIS JUNTOS (EMPILHADOS) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Receita Total: Pix + Cartão
            </h2>
            <p className="text-sm text-gray-500">
              Visão combinada dos últimos 7 dias
            </p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    formatCurrency(Number(val) || 0),
                    String(name),
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                {/* O stackId="1" faz as duas cores se somarem no mesmo gráfico (empilhadas) */}
                <Area
                  type="monotone"
                  dataKey="receitaPix"
                  stackId="1"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  name="Pix"
                />
                <Area
                  type="monotone"
                  dataKey="receitaCartao"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  name="Cartão"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICOS 2 E 3: SEPARADOS LADO A LADO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SÓ PIX */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaPix className="text-teal-500" /> Desempenho Pix
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyData}>
                  <defs>
                    <linearGradient id="colorPix" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(val: any) => [
                      formatCurrency(Number(val) || 0),
                      "Pix",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="receitaPix"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fill="url(#colorPix)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SÓ CARTÃO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCreditCard className="text-blue-500" /> Desempenho Cartão
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyData}>
                  <defs>
                    <linearGradient
                      id="colorCartao"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(val: any) => [
                      formatCurrency(Number(val) || 0),
                      "Cartão",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="receitaCartao"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorCartao)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* --- GRÁFICO DE TRÁFEGO VS PEDIDOS --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUsers className="text-purple-500" /> Tráfego de Usuários
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="visitas"
                  fill="#a855f7"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  name="Visitas"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            {/* <FaShoppingCart className="text-orange-500" /> */}
            Conversão de Pedidos
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Line
                  type="stepAfter"
                  dataKey="pedidos"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#f97316" }}
                  name="Qtd Pedidos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
