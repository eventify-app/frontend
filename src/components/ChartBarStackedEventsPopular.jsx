"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


// ⭐ Componente final para mostrar eventos más populares
export function ChartBarStackedEventsPopular({ events = [] }) {
  // Si no hay datos → mensaje
  if (!events || events.length === 0) {
    return (
      <Card className="p-8 flex items-center justify-center text-gray-500">
        No hay datos de popularidad disponibles.
      </Card>
    );
  }

  // Adaptar datos del backend para Recharts
  const chartData = events.map((ev) => ({
    name: ev.title.length > 12 ? ev.title.slice(0, 12) + "…" : ev.title,
    registrados: ev.participants_count || 0,
    asistentes: ev.attended_count || 0, // si no lo tienes aún, queda en 0
  }));

  // Configuración shadcn
  const chartConfig = {
    registrados: {
      label: "Registrados",
      color: "var(--chart-1)",
    },
    asistentes: {
      label: "Asistentes",
      color: "var(--chart-2)",
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Eventos más populares</CardTitle>
        <CardDescription>
          Basado en registros y asistencia real
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            height={300}
            barGap={4}
            barCategoryGap="20%"
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />

            {/* Tooltip shadcn */}
            <ChartTooltip content={<ChartTooltipContent />} />

            {/* Leyenda shadcn */}
            <ChartLegend content={<ChartLegendContent />} />

            {/* Barras apiladas */}
            <Bar
              dataKey="registrados"
              stackId="a"
              fill="var(--color-registrados)"
              radius={[0, 0, 4, 4]}
            />

            <Bar
              dataKey="asistentes"
              stackId="a"
              fill="var(--color-asistentes)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Tendencia positiva este mes <TrendingUp className="h-4 w-4" />
        </div>
        <p className="text-muted-foreground leading-none">
          Comparación entre tus eventos con más interacción
        </p>
      </CardFooter>
    </Card>
  );
}
