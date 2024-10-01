import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

const VerticalBarChart = ({ data }) => (
  <div id='make_audit'>
    <ResponsiveContainer width="100%" height={300}> 
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#f9f8fd" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const ProgressLineChart = ({ data }) => (
  <div style={{ width: '100%', height: '100%' }}>
    <ResponsiveContainer width="100%" height={300}> 
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#f9f8fd" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default VerticalBarChart;
