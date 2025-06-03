
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ProjectChart = () => {
  const barData = [
    { month: 'T1', completed: 4, inProgress: 6, planned: 2 },
    { month: 'T2', completed: 6, inProgress: 4, planned: 3 },
    { month: 'T3', completed: 8, inProgress: 5, planned: 4 },
    { month: 'T4', completed: 3, inProgress: 7, planned: 5 },
    { month: 'T5', completed: 7, inProgress: 3, planned: 2 },
    { month: 'T6', completed: 5, inProgress: 6, planned: 6 },
  ];

  const pieData = [
    { name: 'Hoàn thành', value: 18, color: '#10B981' },
    { name: 'Đang thực hiện', value: 6, color: '#3B82F6' },
    { name: 'Tạm dừng', value: 2, color: '#F59E0B' },
    { name: 'Hủy bỏ', value: 1, color: '#EF4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card p-6 rounded-lg shadow border">
        <h3 className="text-lg font-medium text-card-foreground mb-4">Tiến độ dự án theo tháng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" stackId="a" fill="#10B981" name="Hoàn thành" />
            <Bar dataKey="inProgress" stackId="a" fill="#3B82F6" name="Đang thực hiện" />
            <Bar dataKey="planned" stackId="a" fill="#F59E0B" name="Kế hoạch" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card p-6 rounded-lg shadow border">
        <h3 className="text-lg font-medium text-card-foreground mb-4">Trạng thái dự án</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectChart;
