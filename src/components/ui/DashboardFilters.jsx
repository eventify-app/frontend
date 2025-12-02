import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Button } from "./button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./select";
import { Calendar } from "./calendar";

export default function DashboardFilters({ dateRange, setDateRange, category, setCategory, onApply }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div>
          <Calendar mode="range" selected={dateRange} onSelect={setDateRange} />
        </div>

        <div className="flex items-center gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todas</SelectItem>
              <SelectItem value="Sports">Deportes</SelectItem>
              <SelectItem value="Culture">Cultura</SelectItem>
              <SelectItem value="Tech">Tecnología</SelectItem>
              <SelectItem value="Academic">Académico</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
              <SelectItem value="Art">Arte</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onApply}>Aplicar</Button>
        </div>
      </CardContent>
    </Card>
  );
}