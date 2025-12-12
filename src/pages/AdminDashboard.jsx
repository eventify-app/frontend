// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import adminService from "../api/services/adminService";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#7C3AED"];

function exportToCSV(filename, rows) {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(","), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
    // ---------- AUTH ----------
    const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    let user = null;
    try {
        user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
        user = null;
    }
    const isAdmin = user?.is_admin === true;

    const navigate = useNavigate();

    // ---------- MENU STATE ----------
    const [activeSection, setActiveSection] = useState("analiticas"); // "analiticas", "eventos", "comentarios"

    // ---------- FILTERS ----------
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [openEventRow, setOpenEventRow] = useState(null);
    const [openCommentRow, setOpenCommentRow] = useState(null);

    // ---------- ANALYTICS ----------
    const [topCategories, setTopCategories] = useState([]);
    const [topCreators, setTopCreators] = useState([]);
    const [topEvents, setTopEvents] = useState([]);
    const [analyticsError, setAnalyticsError] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // ---------- REPORTED EVENTS (PAGINATED) ----------
    const [reportedEvents, setReportedEvents] = useState([]);
    const [eventsCount, setEventsCount] = useState(0);
    const [eventsNext, setEventsNext] = useState(null);
    const [eventsPrev, setEventsPrev] = useState(null);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventsSearch, setEventsSearch] = useState("");
    const eventsSearchRef = useRef(null);
    const [eventsOrdering, setEventsOrdering] = useState("-latest_report_date");

    // ---------- REPORTED COMMENTS (PAGINATED) ----------
    const [reportedComments, setReportedComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(0);
    const [commentsNext, setCommentsNext] = useState(null);
    const [commentsPrev, setCommentsPrev] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsSearch, setCommentsSearch] = useState("");
    const commentsSearchRef = useRef(null);
    const [commentsOrdering, setCommentsOrdering] = useState("-latest_report_date");

    // ---------- UI ----------
    const [errorMessage, setErrorMessage] = useState(null);

    // ---------- DEBOUNCES ----------
    useEffect(() => {
        if (!isAdmin) return;
        const id = setTimeout(() => {
            if (activeSection === "eventos") {
                loadReportedEvents({
                    search: eventsSearch,
                    ordering: eventsOrdering,
                    from_: startDate,
                    to: endDate,
                    category: categoryFilter,
                });
            }
        }, 450);
        return () => clearTimeout(id);
    }, [eventsSearch, eventsOrdering, startDate, endDate, categoryFilter, activeSection]);

    useEffect(() => {
        if (!isAdmin) return;
        const id = setTimeout(() => {
            if (activeSection === "comentarios") {
                loadReportedComments({ search: commentsSearch, ordering: commentsOrdering });
            }
        }, 450);
        return () => clearTimeout(id);
    }, [commentsSearch, commentsOrdering, activeSection]);

    // ---------- INITIAL LOAD ----------
    useEffect(() => {
        if (!isAdmin) return;
        (async () => {
            await Promise.allSettled([
                loadCategories(),
                loadAnalytics(),
                loadReportedEvents(),
                loadReportedComments(),
            ]);
        })();
    }, [isAdmin]);

    /* ---------- load functions ---------- */
    async function loadCategories() {
        try {
            const data = await adminService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error("loadCategories:", err);
            setErrorMessage("No se pudieron cargar las categorías.");
        }
    }

    async function loadAnalytics() {
        setAnalyticsLoading(true);
        setAnalyticsError(null);
        try {
            const params = {};
            if (startDate) params.from_ = startDate;
            if (endDate) params.to = endDate;
            if (categoryFilter) params.category = categoryFilter;

            const [catRes, creatorsRes, eventsRes] = await Promise.all([
                adminService.getTopCategories(params),
                adminService.getTopCreators(params),
                adminService.getTopEvents(params),
            ]);

            setTopCategories(
                (Array.isArray(catRes) ? catRes : (catRes?.data ?? catRes?.results ?? catRes))
                    .map(c => ({
                        id: c.category_id,
                        name: c.category_name,
                        count: c.enrollments,
                    }))
            );
            setTopCreators(Array.isArray(creatorsRes) ? creatorsRes : (creatorsRes?.data ?? creatorsRes?.results ?? creatorsRes));
            setTopEvents(
                (Array.isArray(eventsRes) ? eventsRes : (eventsRes?.data ?? eventsRes?.results ?? eventsRes))
                    .map(item => ({
                        id: item.event.id,
                        title: item.event.title,
                        count: item.enrollments,
                    }))
            );
        } catch (err) {
            console.error("loadAnalytics error:", err);
            setAnalyticsError("No se pudieron cargar los datos analíticos. Intenta nuevamente.");
            setTopCategories([]);
            setTopCreators([]);
            setTopEvents([]);
        } finally {
            setAnalyticsLoading(false);
        }
    }

    async function loadReportedEvents({
        url = null,
        search = "",
        ordering = "-latest_report_date",
        page = null,
        from_ = "",
        to = "",
        category = "",
    } = {}) {
        setEventsLoading(true);
        setErrorMessage(null);
        try {
            let data;
            if (url) {
                data = await adminService.fetchReportedEvents(url);
            } else {
                const params = {};
                if (search) params.search = search;
                if (ordering) params.ordering = ordering;
                if (page) params.page = page;
                if (from_) params.from_ = from_;
                if (to) params.to = to;
                if (category) params.category = category;
                data = await adminService.fetchReportedEvents(params);
            }

            setReportedEvents(data.results ?? []);
            setEventsCount(data.count ?? 0);
            setEventsNext(data.next ?? null);
            setEventsPrev(data.previous ?? null);
        } catch (err) {
            console.error("loadReportedEvents:", err);
            setErrorMessage("No se pudieron cargar los eventos reportados.");
            setReportedEvents([]);
            setEventsCount(0);
            setEventsNext(null);
            setEventsPrev(null);
        } finally {
            setEventsLoading(false);
        }
    }

    async function loadReportedComments({
        url = null,
        search = "",
        ordering = "-latest_report_date",
        page = null,
    } = {}) {
        setCommentsLoading(true);
        setErrorMessage(null);
        try {
            let data;
            if (url) {
                data = await adminService.fetchReportedComments(url);
            } else {
                const params = {};
                if (search) params.search = search;
                if (ordering) params.ordering = ordering;
                if (page) params.page = page;
                data = await adminService.fetchReportedComments(params);
            }

            setReportedComments(data.results ?? []);
            setCommentsCount(data.count ?? 0);
            setCommentsNext(data.next ?? null);
            setCommentsPrev(data.previous ?? null);
        } catch (err) {
            console.error("loadReportedComments:", err);
            setErrorMessage("No se pudieron cargar los comentarios reportados.");
            setReportedComments([]);
            setCommentsCount(0);
            setCommentsNext(null);
            setCommentsPrev(null);
        } finally {
            setCommentsLoading(false);
        }
    }

    /* ---------- actions ---------- */
    async function handleDisableEvent(reportItem) {
        const id = reportItem?.event?.id ?? reportItem?.id;
        if (!id) return;
        if (!confirm("¿Seguro que deseas inhabilitar este evento?")) return;
        try {
            await adminService.disableEvent(id);
            if (eventsNext || eventsPrev) {
                await loadReportedEvents({
                    search: eventsSearch,
                    ordering: eventsOrdering,
                    from_: startDate,
                    to: endDate,
                    category: categoryFilter,
                });
            } else {
                await loadReportedEvents();
            }
        } catch (err) {
            console.error("disableEvent:", err);
            alert("Error al inhabilitar el evento.");
        }
    }

    async function handleRestoreEvent(reportItem) {
        const id = reportItem?.event?.id ?? reportItem?.id;
        if (!id) return;
        if (!confirm("¿Restaurar este evento?")) return;
        try {
            await adminService.restoreEvent(id);
            await loadReportedEvents();
        } catch (err) {
            console.error("restoreEvent:", err);
            alert("Error al restaurar el evento.");
        }
    }

    async function handleDisableComment(reportItem) {
        const id = reportItem?.comment?.id ?? reportItem?.id;
        if (!id) return;
        if (!confirm("¿Seguro que deseas inhabilitar este comentario?")) return;
        try {
            await adminService.disableComment(id);
            await loadReportedComments();
        } catch (err) {
            console.error("disableComment:", err);
            alert("Error al inhabilitar el comentario.");
        }
    }

    async function handleRestoreComment(reportItem) {
        const id = reportItem?.comment?.id ?? reportItem?.id;
        if (!id) return;
        if (!confirm("¿Restaurar este comentario?")) return;
        try {
            await adminService.restoreComment(id);
            await loadReportedComments();
        } catch (err) {
            console.error("restoreComment:", err);
            alert("Error al restaurar el comentario.");
        }
    }

    /* ---------- helpers / derived ---------- */
    const eventsTableRows = useMemo(() => {
        return reportedEvents.map((r) => ({
            id: r.event?.id ?? r.id,
            title: r.event?.title ?? r.title ?? "—",
            place: r.event?.place ?? "—",
            report_count: r.report_count ?? (r.reports?.length ?? 0),
            latest_report_date: r.latest_report_date ?? r.updated_at ?? "—",
            raw: r,
        }));
    }, [reportedEvents]);

    const commentsTableRows = useMemo(() => {
        return reportedComments.map((r) => ({
            id: r.comment?.id ?? r.id,
            content: r.comment?.content ?? r.comment?.text ?? "—",
            author: r.comment?.author ?? r.comment?.author_username ?? r.comment?.user?.username ?? "—",
            report_count: r.report_count ?? (r.reports?.length ?? 0),
            latest_report_date: r.latest_report_date ?? r.updated_at ?? "—",
            raw: r,
        }));
    }, [reportedComments]);

    /* ---------- render ---------- */
    if (!isAdmin) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Acceso denegado</h2>
                    <p className="text-sm text-gray-600">Necesitas permisos de administrador.</p>
                </div>
            </div>
        );
    }

    const renderAnalyticsSection = () => (
        <>
            {/* FILTERS */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card-background p-4 rounded-lg shadow">
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Fecha inicio</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 w-full border rounded px-3 py-2" />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium">Fecha fin</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 w-full border rounded px-3 py-2" />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium">Categoría</label>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                        className="mt-1 w-full border rounded px-3 py-2">
                        <option value="">(Todas)</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.type ?? c.name ?? c.title ?? c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => { 
                            loadAnalytics(); 
                            if (activeSection === "eventos") {
                                loadReportedEvents({ from_: startDate, to: endDate, category: categoryFilter });
                            }
                        }}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Aplicar filtros
                    </button>
                </div>
            </section>

            {/* KPI CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-card-background p-5 rounded-lg shadow text-center md:text-left">
                    <div className="text-sm text-gray-500">Eventos destacados</div>
                    <div className="text-3xl font-bold mt-2">{topEvents?.length ?? 0}</div>
                </div>

                <div className="bg-card-background p-5 rounded-lg shadow text-center md:text-left">
                    <div className="text-sm text-gray-500">Categorías</div>
                    <div className="text-3xl font-bold mt-2">{topCategories?.length ?? 0}</div>
                </div>

                <div className="bg-card-background p-5 rounded-lg shadow text-center md:text-left">
                    <div className="text-sm text-gray-500">Creadores</div>
                    <div className="text-3xl font-bold mt-2">{topCreators?.length ?? 0}</div>
                </div>
            </section>

            {/* CHARTS */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card-background p-5 rounded-lg shadow min-h-[260px]">
                    <h3 className="font-semibold mb-3">Top Categorías</h3>
                    <div className="w-full h-[220px]">
                        {analyticsLoading ? <p>Cargando...</p> :
                        (topCategories && topCategories.length > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCategories}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill={COLORS[0]} />
                            </BarChart>
                            </ResponsiveContainer>
                        ) : <p className="text-sm text-gray-500">Sin datos</p>
                        }
                    </div>
                </div>

                <div className="bg-card-background p-5 rounded-lg shadow min-h-[260px]">
                    <h3 className="font-semibold mb-3">Top Eventos (por inscripciones)</h3>
                    <div className="w-full h-[220px]">
                        {analyticsLoading ? <p>Cargando...</p> :
                            (topEvents && topEvents.length > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={topEvents} dataKey="count" nameKey="title" outerRadius={80}>
                                            {topEvents?.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <p className="text-sm text-gray-500">Sin datos</p>
                        }
                    </div>
                </div>
            </section>

            {/* TOP TABLES */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card-background p-5 rounded-lg shadow">
                    <h3 className="font-semibold mb-3">Top Eventos</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm text-gray-600">
                                    <th className="py-2 pr-4">Evento</th>
                                    <th className="py-2">Inscritos</th>
                                </tr>
                            </thead>
                            <tbody>
                            {topEvents?.map((e, i) => (
                                <tr
                                key={i}
                                className="border-t cursor-pointer hover:bg-primary transition"
                                onClick={() => navigate(`/event/${e.id}`)}
                                >
                                <td className="py-2 pr-4">{e.title}</td>
                                <td className="py-2">{e.count}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-card-background p-5 rounded-lg shadow">
                    <h3 className="font-semibold mb-3">Top Categorías</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm text-gray-600">
                                    <th className="py-2 pr-4">Categoría</th>
                                    <th className="py-2">Incritos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCategories?.map((c, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="py-2 pr-4">{c.type ?? c.name}</td>
                                        <td className="py-2">{c.count ?? "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );

    const renderEventsSection = () => (
        <section className="bg-card-background p-5 rounded-lg shadow space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h3 className="text-xl font-semibold">Eventos reportados</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar eventos..."
                        value={eventsSearch}
                        onChange={(e) => setEventsSearch(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    />
                    <select
                        value={eventsOrdering}
                        onChange={(e) => setEventsOrdering(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="-latest_report_date">Más recientes primero</option>
                        <option value="latest_report_date">Más antiguos primero</option>
                        <option value="-report_count">Más reportes</option>
                        <option value="report_count">Menos reportes</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm text-gray-600 border-b">
                            <th className="py-2 pr-4">Evento</th>
                            <th className="py-2 pr-4">Lugar</th>
                            <th className="py-2 pr-4"># Reportes</th>
                            <th className="py-2 pr-4">Último reporte</th>
                            <th className="py-2 pr-4">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportedEvents.map((item, idx) => {
                            const isOpen = openEventRow === idx;

                            return (
                                <React.Fragment key={idx}>
                                    <tr className="border-t hover:bg-primary transition">
                                        <td className="py-2">{item.event?.title}</td>
                                        <td className="py-2">{item.event?.place}</td>
                                        <td className="py-2">{item.report_count}</td>
                                        <td className="py-2">
                                            {new Date(item.latest_report_date).toLocaleString()}
                                        </td>

                                        <td className="py-2 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setOpenEventRow(isOpen ? null : idx)
                                                }
                                                className="px-3 py-1 text-sm bg-background rounded hover:bg-background/70"
                                            >
                                                {isOpen ? "Ocultar" : "Ver detalles"}
                                            </button>

                                            {item.event?.is_active ? (
                                                <button
                                                    onClick={() => handleDisableEvent(item)}
                                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Inhabilitar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRestoreEvent(item)}
                                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Restaurar
                                                </button>
                                            )}
                                        </td>
                                    </tr>

                                    {isOpen && (
                                        <tr className="bg-background">
                                            <td colSpan="5" className="p-4">
                                                <h4 className="font-medium mb-2">
                                                    Motivos del reporte
                                                </h4>

                                                {item.reports?.map((rep, i) => (
                                                    <div
                                                        key={i}
                                                        className="border rounded p-3 mb-3 bg-background"
                                                    >
                                                        <p className="text-sm">
                                                            <span className="font-semibold">Reportado por:</span>{" "}
                                                            {rep.reported_by?.username}
                                                        </p>

                                                        <p className="text-sm mt-1">
                                                            <span className="font-semibold">Razón:</span>{" "}
                                                            {rep.reason}
                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(rep.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-between pt-4">
                <button
                    disabled={!eventsPrev}
                    onClick={() => loadReportedEvents({ url: eventsPrev })}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm text-gray-600 self-center">
                    Total: {eventsCount} eventos
                </span>
                <button
                    disabled={!eventsNext}
                    onClick={() => loadReportedEvents({ url: eventsNext })}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </section>
    );

    const renderCommentsSection = () => (
        <section className="bg-card-background p-5 rounded-lg shadow space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h3 className="text-xl font-semibold">Comentarios reportados</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar comentarios..."
                        value={commentsSearch}
                        onChange={(e) => setCommentsSearch(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    />
                    <select
                        value={commentsOrdering}
                        onChange={(e) => setCommentsOrdering(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="-latest_report_date">Más recientes primero</option>
                        <option value="latest_report_date">Más antiguos primero</option>
                        <option value="-report_count">Más reportes</option>
                        <option value="report_count">Menos reportes</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm text-gray-600 border-b">
                            <th className="py-2 pr-4">Comentario</th>
                            <th className="py-2 pr-4">Autor</th>
                            <th className="py-2 pr-4"># Reportes</th>
                            <th className="py-2 pr-4">Último reporte</th>
                            <th className="py-2 pr-4">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportedComments.map((item, idx) => {
                            const isOpen = openCommentRow === idx;

                            return (
                                <React.Fragment key={idx}>
                                    <tr className="border-t hover:bg-primary transition">
                                        <td className="py-2">{item.comment?.content}</td>
                                        <td className="py-2">{item.comment?.author}</td>
                                        <td className="py-2">{item.report_count}</td>
                                        <td className="py-2">
                                            {new Date(item.latest_report_date).toLocaleString()}
                                        </td>

                                        <td className="py-2 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setOpenCommentRow(isOpen ? null : idx)
                                                }
                                                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                {isOpen ? "Ocultar" : "Ver motivos"}
                                            </button>

                                            {item.comment?.is_active ? (
                                                <button
                                                    onClick={() => handleDisableComment(item)}
                                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Inhabilitar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRestoreComment(item)}
                                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Restaurar
                                                </button>
                                            )}
                                        </td>
                                    </tr>

                                    {isOpen && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="5" className="p-4">
                                                <h4 className="font-medium text-gray-700 mb-2">
                                                    Motivos del reporte
                                                </h4>

                                                {item.reports?.map((rep, i) => (
                                                    <div
                                                        key={i}
                                                        className="border rounded p-3 mb-3 bg-white"
                                                    >
                                                        <p className="text-sm">
                                                            <span className="font-semibold">Reportado por:</span>{" "}
                                                            {rep.reported_by?.username}
                                                        </p>

                                                        <p className="text-sm mt-1">
                                                            <span className="font-semibold">Razón:</span>{" "}
                                                            {rep.reason}
                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(rep.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-between pt-4">
                <button
                    disabled={!commentsPrev}
                    onClick={() => loadReportedComments({ url: commentsPrev })}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm text-gray-600 self-center">
                    Total: {commentsCount} comentarios
                </span>
                <button
                    disabled={!commentsNext}
                    onClick={() => loadReportedComments({ url: commentsNext })}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </section>
    );

    return (
        <div className="lg:px-12 pt-24 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-8">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold leading-tight">
                    Panel Administrativo
                </h1>
            </header>

            {/* MENU DE NAVEGACIÓN */}
            <nav className="flex flex-wrap gap-2 border-b pb-4">
                <button
                    onClick={() => setActiveSection("analiticas")}
                    className={`px-4 py-2 rounded-md transition ${activeSection === "analiticas" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-background hover:bg-primary"}`}
                >
                    Analíticas
                </button>
                <button
                    onClick={() => setActiveSection("eventos")}
                    className={`px-4 py-2 rounded-md transition ${activeSection === "eventos" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-background hover:bg-primary"}`}
                >
                    Reportes de Eventos
                </button>
                <button
                    onClick={() => setActiveSection("comentarios")}
                    className={`px-4 py-2 rounded-md transition ${activeSection === "comentarios" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-background hover:bg-primary"}`}
                >
                    Reportes de Comentarios
                </button>
            </nav>

            {/* CONTENIDO DE LA SECCIÓN ACTIVA */}
            {activeSection === "analiticas" && renderAnalyticsSection()}
            {activeSection === "eventos" && renderEventsSection()}
            {activeSection === "comentarios" && renderCommentsSection()}

            {/* global error */}
            {errorMessage && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{errorMessage}</div>}
        </div>
    );
}