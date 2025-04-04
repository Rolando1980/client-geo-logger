import React from "react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type VisitsByDayData = {
  date: string;
  count: number;
}[];

interface VisitsChartProps {
  visitsByDay: VisitsByDayData;
}

const VisitsChart: React.FC<VisitsChartProps> = ({ visitsByDay }) => {
  return (
    // Contenedor con margen superior para bajar el gráfico
    <div className="mt-4">
      {/* Aumentamos la altura a 90px para mayor espacio vertical */}
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={visitsByDay} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(label) => {
              const date = parse(label, "yyyy-MM-dd", new Date());
              return format(date, "d", { locale: es });
            }}
            tick={{ fill: "transparent", fontSize: 1 }}
            axisLine={{ stroke: "transparent" }}
            tickLine={{ stroke: "transparent" }}
          />
          {/* Ajustamos el dominio para que la escala vertical se extienda */}
          <YAxis hide={true} domain={['dataMin - 1', 'dataMax + 1']} />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#4ade80" 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={true}
            activeDot={{ r: 4, fill: "#4ade80", stroke: "#fff", strokeWidth: 2 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "none", 
              borderRadius: "8px", 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              fontSize: "12px",
              padding: "4px 8px"
            }}
            formatter={(value) => [`${value} visitas`, ""]}          
            labelFormatter={(label) => {
              try {
                const date = parse(label, "yyyy-MM-dd", new Date());
                const day = format(date, "d", { locale: es });
                const month = format(date, "MMM", { locale: es });
                return `${day} ${month}`;
              } catch (error) {
                return label;
              }
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitsChart;
