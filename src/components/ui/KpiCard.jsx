import { Card, CardHeader, CardTitle, CardContent } from "./card";

export default function KpiCard({ title, value, className }) {
  return (
    <Card
      className={`min-h-[140px] flex flex-col justify-center items-center text-center shadow-md ${className}`}
    >
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-lg font-semibold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <p className="text-3xl font-bold text-primary text-center">
          {value !== null && value !== undefined ? value : "Sin datos"}
        </p>
      </CardContent>
    </Card>
  );
}