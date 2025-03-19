
import React from "react";
import { format, formatDate } from "date-fns";
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
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={visitsByDay} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
            const date = new Date(label);
            const day = date.getDate();
            const month = format(date, "MMM", { locale: es });
            return `${day} ${month}`;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VisitsChart;
