
import React, { useState } from 'react';
import { Plus, Edit, Trash, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Ecommerce',
      description: 'Xây dựng website bán hàng trực tuyến',
      status: 'active',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      team: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
      budget: 500000000,
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'Ứng dụng di động cho khách hàng',
      status: 'completed',
      progress: 100,
      startDate: '2023-10-01',
      endDate: '2024-02-28',
      team: ['Phạm Thị D', 'Hoàng Văn E'],
      budget: 300000000,
    },
    {
      id: 3,
      name: 'API Gateway',
      description: 'Hệ thống API trung tâm',
      status: 'active',
      progress: 45,
      startDate: '2024-03-01',
      endDate: '2024-08-15',
      team: ['Lê Văn C', 'Võ Thị F'],
      budget: 200000000,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'paused': return 'Tạm dừng';
      case 'cancelled': return 'Hủy bỏ';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý dự án</h1>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dự án
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm dự án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                  <span className="text-sm text-gray-500">{project.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Bắt đầu:</span>
                    <span>{new Date(project.startDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kết thúc:</span>
                    <span>{new Date(project.endDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngân sách:</span>
                    <span>{project.budget.toLocaleString('vi-VN')} VND</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Nhóm thực hiện:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.team.map((member, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy dự án</h3>
          <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc tạo dự án mới.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
