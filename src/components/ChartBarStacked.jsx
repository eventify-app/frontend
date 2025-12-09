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

export function ChartBarStacked({ data }) {
  if (!Array.isArray(data)) {
    console.warn("ChartBarStacked: data inválido →", data);
    return null;
  }

  const chartData = data.map((ev) => ({
    title:
      ev?.event?.title
        ? ev.event.title.length > 10
          ? ev.event.title.slice(0, 10) + "…"
          : ev.event.title
        : "Sin título",

    registrados: Number(ev?.total_participants) || 0,
    asistentes: Number(ev?.total_attended) || 0,
  }));

  if (chartData.length === 0) {
    return (
      <Card className="flex items-center justify-center p-10 w-full">
        <p className="text-muted-foreground text-center">
          No hay eventos populares.
        </p>
      </Card>
    );
  }

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
        <CardTitle>Eventos Populares</CardTitle>
        <CardDescription>Registrados vs Asistentes</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />

            {/* Registrados */}
            <Bar
              dataKey="registrados"
              stackId="a"
              fill="var(--chart-1)"
              radius={[0, 0, 4, 4]}
            />

            {/* Asistentes */}
            <Bar
              dataKey="asistentes"
              stackId="a"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
