import { useAuthStore } from "../../store/AuthStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- DADOS FAKE PARA OS GRÁFICOS (Substitua depois por dados da API) ---
const MOCK_STATS = {
  dailyData: [
    { name: "Seg", acessos: 400, unicos: 240 },
    { name: "Ter", acessos: 300, unicos: 139 },
    { name: "Qua", acessos: 200, unicos: 980 },
    { name: "Qui", acessos: 278, unicos: 390 },
    { name: "Sex", acessos: 189, unicos: 480 },
  ],
  monthlyData: [
    { name: "Jan", acessos: 2400, unicos: 1400 },
    { name: "Fev", acessos: 1398, unicos: 900 },
    { name: "Mar", acessos: 9800, unicos: 6200 },
    { name: "Abr", acessos: 3908, unicos: 2100 },
    { name: "Mai", acessos: 4800, unicos: 2800 },
    { name: "Jun", acessos: 3800, unicos: 2300 },
    { name: "Jul", acessos: 4300, unicos: 2600 },
    { name: "Ago", acessos: 5300, unicos: 3200 },
    { name: "Set", acessos: 6100, unicos: 4100 },
    { name: "Out", acessos: 7200, unicos: 4500 },
    { name: "Nov", acessos: 6500, unicos: 4200 },
    { name: "Dez", acessos: 8100, unicos: 5100 },
  ],
};

const AdminPage = () => {
  const { user } = useAuthStore();
  const stats = MOCK_STATS; // Usando os dados mockados

  return (
    <div className="space-y-8  pb-16 ">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">
          Visão geral do sistema. Olá,{" "}
          <span className="font-semibold text-blue-600">{user?.name}</span>.
        </p>
      </header>

      <hr className="border-gray-200" />

      {/* --- SEÇÃO 1: ACESSOS GERAIS --- */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Acessos</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-600 mb-6">
            Engajamento Recente (5 Dias)
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.dailyData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  cursor={{ fill: "#f3f4f6" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                {/* BARRA 1: TOTAL DE PÁGINAS VISTAS (AZUL) */}
                <Bar
                  name="Páginas Vistas"
                  dataKey="acessos"
                  fill="#6366f1" // Indigo-500
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                {/* BARRA 2: VISITANTES ÚNICOS (VERDE) */}
                <Bar
                  name="Visitantes Únicos"
                  dataKey="unicos"
                  fill="#34d399" // Emerald-400
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO 2: VISITANTES --- */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">
          Visitantes
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GRÁFICO 1: DIÁRIO (5 Dias) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">
              Engajamento Recente (5 Dias)
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.dailyData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar
                    name="Visitantes Únicos"
                    dataKey="unicos"
                    fill="#34d399" // Emerald-400
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICO 2: MENSAL (Ano Atual) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">
              Desempenho no Ano ({new Date().getFullYear()})
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.monthlyData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    fontSize={12}
                    tick={{ dy: 5, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Area
                    name="Visitantes Únicos"
                    type="monotone"
                    dataKey="unicos"
                    stroke="#34d399"
                    fill="#34d399"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO 3: PÁGINAS VISTAS --- */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">
          Páginas Vistas
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: Últimos 5 Dias (Barras) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">
              Acessos Recentes (5 Dias)
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="acessos"
                    fill="#6366f1" // Indigo-500
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Mensal (Área/Linha) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">
              Acessos por Mês ({new Date().getFullYear()})
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    fontSize={12}
                    tick={{ dy: 5, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="acessos"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
