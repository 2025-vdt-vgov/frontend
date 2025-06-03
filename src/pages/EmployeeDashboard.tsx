
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const EmployeeDashboard = () => {
  const userProjects = [
    { 
      name: 'Website Ecommerce', 
      status: 'Đang thực hiện', 
      progress: 75, 
      deadline: '2024-02-15',
      tasks: 8,
      completedTasks: 6
    },
    { 
      name: 'Mobile App UI', 
      status: 'Hoàn thành', 
      progress: 100, 
      deadline: '2024-01-30',
      tasks: 12,
      completedTasks: 12
    },
  ];

  const recentTasks = [
    { name: 'Hoàn thiện giao diện login', status: 'completed', dueDate: '2024-01-28' },
    { name: 'Fix bug responsive mobile', status: 'in-progress', dueDate: '2024-02-02' },
    { name: 'Review code component header', status: 'pending', dueDate: '2024-02-05' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dự án của tôi</h1>
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án đang làm</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">dự án active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/20</div>
            <p className="text-xs text-muted-foreground">tuần này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadline gần</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">trong 7 ngày</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Dự án hiện tại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{project.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Deadline: {project.deadline}</span>
                    <span>Tasks: {project.completedTasks}/{project.tasks}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Badge variant={project.status === 'Hoàn thành' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Task gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <p className="font-medium">{task.name}</p>
                  <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                </div>
                <Badge 
                  variant={
                    task.status === 'completed' ? 'default' : 
                    task.status === 'in-progress' ? 'secondary' : 'outline'
                  }
                >
                  {task.status === 'completed' ? 'Hoàn thành' : 
                   task.status === 'in-progress' ? 'Đang làm' : 'Chờ'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
