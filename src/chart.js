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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', border: '1px solid lightgray', padding: '5px', borderRadius: '5px' }}>
        <p style={{ color: 'black' }}>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}

const VerticalBarChart = ({ data }) => (
  <div id='make_audit'>
    <ResponsiveContainer width="100%" height={300}> 
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} /> 
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
        <Tooltip content={<CustomTooltip />} /> 
        <Line type="monotone" dataKey="value" stroke="#f9f8fd" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default VerticalBarChart;
