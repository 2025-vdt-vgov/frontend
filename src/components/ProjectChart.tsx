
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from '@/services';
import { DashboardProjectStats, ProjectStatsResponse } from '@/types/api';

const ProjectChart = () => {
  const [projectStats, setProjectStats] = useState<DashboardProjectStats | null>(null);
  const [projectStatsResponse, setProjectStatsResponse] = useState<ProjectStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projectData, statsResponse] = await Promise.all([
          dashboardService.getProjectStats(),
          dashboardService.getProjectStatsResponse()
        ]);
        setProjectStats(projectData);
        setProjectStatsResponse(statsResponse);
      } catch (err) {
        console.error('Error fetching project chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow border animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-[300px] bg-gray-200 rounded"></div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow border animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="h-[300px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !projectStats || !projectStatsResponse) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow border">
          <div className="text-center py-12 text-red-600">
            {error || 'Failed to load chart data'}
          </div>
        </div>
      </div>
    );
  }

  // Generate mock monthly data based on current stats
  const barData = [
    { month: 'T1', completed: Math.floor(projectStats.completedProjects * 0.15), inProgress: Math.floor(projectStats.activeProjects * 0.2), planned: Math.floor(projectStats.plannedProjects * 0.3) },
    { month: 'T2', completed: Math.floor(projectStats.completedProjects * 0.18), inProgress: Math.floor(projectStats.activeProjects * 0.15), planned: Math.floor(projectStats.plannedProjects * 0.2) },
    { month: 'T3', completed: Math.floor(projectStats.completedProjects * 0.22), inProgress: Math.floor(projectStats.activeProjects * 0.25), planned: Math.floor(projectStats.plannedProjects * 0.25) },
    { month: 'T4', completed: Math.floor(projectStats.completedProjects * 0.12), inProgress: Math.floor(projectStats.activeProjects * 0.18), planned: Math.floor(projectStats.plannedProjects * 0.15) },
    { month: 'T5', completed: Math.floor(projectStats.completedProjects * 0.20), inProgress: Math.floor(projectStats.activeProjects * 0.12), planned: Math.floor(projectStats.plannedProjects * 0.1) },
    { month: 'T6', completed: Math.floor(projectStats.completedProjects * 0.13), inProgress: Math.floor(projectStats.activeProjects * 0.1), planned: Math.floor(projectStats.plannedProjects * 0.0) },
  ];

  const pieData = [
    { name: 'Hoàn thành', value: projectStats.completedProjects, color: '#10B981' },
    { name: 'Đang thực hiện', value: projectStats.activeProjects, color: '#3B82F6' },
    { name: 'Kế hoạch', value: projectStats.plannedProjects, color: '#F59E0B' },
    { name: 'Tạm dừng', value: projectStats.onHoldProjects, color: '#F97316' },
    { name: 'Hủy bỏ', value: projectStats.cancelledProjects, color: '#EF4444' },
  ].filter(item => item.value > 0); // Only show categories with data

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
