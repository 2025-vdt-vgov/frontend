
import React from 'react';
import DashboardStats from '../components/DashboardStats';
import ProjectChart from '../components/ProjectChart';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <DashboardStats />

      <ProjectChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg shadow border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-card-foreground mb-4">Dự án gần đây</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-border">
                {[
                  { name: 'Website Ecommerce', status: 'Đang thực hiện', progress: 75, team: 'Frontend Team' },
                  { name: 'Mobile App', status: 'Hoàn thành', progress: 100, team: 'Mobile Team' },
                  { name: 'API Gateway', status: 'Đang thực hiện', progress: 45, team: 'Backend Team' },
                  { name: 'Dashboard Analytics', status: 'Kế hoạch', progress: 10, team: 'Data Team' },
                ].map((project, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.team}</p>
                        <div className="mt-2">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.progress}%
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'Hoàn thành' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        project.status === 'Đang thực hiện' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-card-foreground mb-4">Nhân sự hoạt động</h3>
            <div className="space-y-4">
              {[
                { name: 'Nguyễn Văn A', role: 'Frontend Developer', status: 'online' },
                { name: 'Trần Thị B', role: 'Project Manager', status: 'online' },
                { name: 'Lê Văn C', role: 'Backend Developer', status: 'away' },
                { name: 'Phạm Thị D', role: 'UI/UX Designer', status: 'offline' },
              ].map((person, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    person.status === 'online' ? 'bg-green-400' :
                    person.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
