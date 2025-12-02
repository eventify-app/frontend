import { useEffect, useState } from "react";
import Main from "../layouts/Main";
import DashboardFilters from "../components/ui/DashboardFilters";
import KpiCard from "../components/ui/KpiCard";
import TopTable from "../components/ui/TopTable";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { reportService } from "../api/services/reportService";
import { ChartPieInteractive } from "../components/ChartPieInteractive";
import { ChartBarStacked } from "../components/ChartBarStacked";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [category, setCategory] = useState("All");

  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [topEvents, setTopEvents] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (d) => {
    const dt = new Date(d);
    dt.setHours(12, 0, 0, 0);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const buildFilters = () => ({
    start_date: dateRange?.from ? formatDate(dateRange.from) : undefined,
    end_date: dateRange?.to ? formatDate(dateRange.to) : undefined,
    category: category !== "All" ? category : undefined,
  });

  // 🔹 Datos simulados para pruebas
  const mockReportData = {
    kpis: {
      events_created: 12,
      inscriptions: 320,
      active_categories: 5,
      avg_inscriptions_per_event: 26.7,
    },
    charts: {
      events_vs_inscriptions: [
        { month: "Enero", eventos: 3, inscripciones: 80 },
        { month: "Febrero", eventos: 4, inscripciones: 120 },
        { month: "Marzo", eventos: 5, inscripciones: 120 },
      ],
      categories_distribution: [
        { category: "Académico", count: 6 },
        { category: "Cultural", count: 3 },
        { category: "Deportivo", count: 3 },
      ],
    },
    top_events: [
      { title: "Feria de Tecnología", category: "Académico", inscriptions: 120 },
      { title: "Festival de Música", category: "Cultural", inscriptions: 95 },
      { title: "Congreso de Ingeniería", category: "Académico", inscriptions: 80 },
    ],
    top_categories: [
      { category: "Académico", events: 6, inscriptions: 180 },
      { category: "Cultural", events: 3, inscriptions: 95 },
      { category: "Deportivo", events: 3, inscriptions: 45 },
    ],
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const filters = buildFilters();
      const { kpis, charts, top_events, top_categories } =
        await reportService.getGlobalReports(filters);

      setKpis(kpis || mockReportData.kpis);
      setCharts(charts || mockReportData.charts);
      setTopEvents(top_events?.length ? top_events : mockReportData.top_events);
      setTopCategories(top_categories?.length ? top_categories : mockReportData.top_categories);
    } catch (err) {
      console.error("Error cargando reportes:", err);
      setKpis(mockReportData.kpis);
      setCharts(mockReportData.charts);
      setTopEvents(mockReportData.top_events);
      setTopCategories(mockReportData.top_categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Administrador</h1>

        <DashboardFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          category={category}
          setCategory={setCategory}
          onApply={loadReports}
        />

        {loading ? (
          <p className="text-gray-600">Cargando reportes...</p>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard title="Eventos creados" value={kpis?.events_created ?? "-"} />
              <KpiCard title="Inscripciones" value={kpis?.inscriptions ?? "-"} />
              <KpiCard title="Categorías activas" value={kpis?.active_categories ?? "-"} />
              <KpiCard
                title="Promedio inscripciones/evento"
                value={kpis?.avg_inscriptions_per_event ?? "-"}
              />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="h-full min-h-[300px] flex flex-col">
                <CardHeader><CardTitle>Eventos vs Inscripciones</CardTitle></CardHeader>
                <CardContent className="flex-1">
                  <ChartBarStacked data={charts?.events_vs_inscriptions || []} />
                </CardContent>
              </Card>
              <Card className="h-full min-h-[300px] flex flex-col">
                <CardHeader><CardTitle>Distribución por Categoría</CardTitle></CardHeader>
                <CardContent className="flex-1">
                  <ChartPieInteractive data={charts?.categories_distribution || []} />
                </CardContent>
              </Card>
            </div>

            {/* Tablas Top N */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="overflow-x-auto">
                <TopTable
                  title="Top 5 Eventos"
                  columns={[
                    { label: "Evento", accessor: "title" },
                    { label: "Categoría", accessor: "category" },
                    { label: "Inscritos", accessor: "inscriptions" },
                  ]}
                  data={topEvents}
                />
              </div>
              <div className="overflow-x-auto">
                <TopTable
                  title="Top 5 Categorías"
                  columns={[
                    { label: "Categoría", accessor: "category" },
                    { label: "Eventos", accessor: "events" },
                    { label: "Inscripciones", accessor: "inscriptions" },
                  ]}
                  data={topCategories}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Main>
  );
}