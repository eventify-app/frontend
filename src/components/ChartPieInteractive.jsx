import React, { useState, useMemo } from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
]

export function ChartPieInteractive({ data }) {
  const id = "pie-category"

  // no data
  if (!data || data.length === 0) {
    return (
      <Card className="flex w-full flex-col p-6 justify-center items-center text-gray-500">
        No hay datos por categoría.
      </Card>
    )
  }

  // adapt backend → asistentes
  const chartData = data.map((item, index) => ({
    category: item.category?.type || "Sin categoría",
    value: item.total_attended || 0, // ✅ corregido
    fill: COLORS[index % COLORS.length],
  }))

  // 🔥 VALIDACIÓN: no hay asistentes en ninguna categoría
  const totalAssistants = chartData.reduce((sum, item) => sum + item.value, 0)

  if (totalAssistants === 0) {
    return (
      <Card className="flex w-full flex-col p-6 justify-center items-center text-gray-500 text-center">
        <CardTitle className="text-lg mb-1">Sin asistentes</CardTitle>
        <CardDescription>
          No hay asistentes registrados en ninguna categoría.
        </CardDescription>
      </Card>
    )
  }

  const categories = chartData.map((d) => d.category)
  const [activeCategory, setActiveCategory] = useState(categories[0])

  const activeIndex = useMemo(
    () => chartData.findIndex((item) => item.category === activeCategory),
    [activeCategory, chartData]
  )

  const chartConfig = {}
  categories.forEach((cat, i) => {
    chartConfig[cat] = {
      label: cat,
      color: COLORS[i % COLORS.length],
    }
  })

  return (
    <Card data-chart={id} className="flex w-full flex-col">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Asistentes por Categoría</CardTitle>
          <CardDescription>Total de asistentes agrupados por categoría</CardDescription>
        </div>

        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="ml-auto h-7 w-[150px] rounded-lg pl-2.5">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {categories.map((cat, index) => (
              <SelectItem key={cat} value={cat}>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {cat}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const value = chartData[activeIndex].value
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Asistentes
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
