import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts';

// Vertical Bar Chart Component
const VerticalBarChart = ({ data }) => (
  <div style={{ width: '600px', height: '400px' }}>
    <BarChart width={600} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#4CAF50" />
    </BarChart>
  </div>
);

// Line Chart Component for Progress
export const ProgressLineChart = ({ data }) => (
  <div style={{ width: '600px', height: '400px' }}>
    <LineChart width={600} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  </div>
);


export default VerticalBarChart;
