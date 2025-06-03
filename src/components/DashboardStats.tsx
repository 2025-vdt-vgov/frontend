
import React from 'react';
import { Users, Folder, Check, BarChart } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      name: 'Tổng dự án',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: Folder,
      color: 'bg-blue-500',
    },
    {
      name: 'Nhân sự',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Dự án hoàn thành',
      value: '18',
      change: '+5%',
      changeType: 'increase',
      icon: Check,
      color: 'bg-purple-500',
    },
    {
      name: 'Hiệu suất',
      value: '85%',
      change: '+2%',
      changeType: 'increase',
      icon: BarChart,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="relative bg-card pt-5 px-4 pb-5 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border transform hover:scale-105 transition-transform duration-200"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 text-sm font-medium text-muted-foreground truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-card-foreground">{stat.value}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {stat.change}
              </p>
            </dd>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
