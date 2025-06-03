
import React, { useState } from 'react';
import { Plus, Edit, Trash, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Employees = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@company.com',
      role: 'employee',
      position: 'Frontend Developer',
      department: 'Development',
      joinDate: '2023-01-15',
      salary: 25000000,
      status: 'active',
      projects: ['Website Ecommerce', 'Mobile App'],
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@company.com',
      role: 'pm',
      position: 'Project Manager',
      department: 'Management',
      joinDate: '2022-08-10',
      salary: 35000000,
      status: 'active',
      projects: ['Website Ecommerce', 'API Gateway'],
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@company.com',
      role: 'employee',
      position: 'Backend Developer',
      department: 'Development',
      joinDate: '2023-03-20',
      salary: 28000000,
      status: 'active',
      projects: ['API Gateway'],
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      email: 'phamthid@company.com',
      role: 'admin',
      position: 'UI/UX Designer',
      department: 'Design',
      joinDate: '2022-12-05',
      salary: 30000000,
      status: 'active',
      projects: ['Mobile App'],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'pm': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'pm': return 'Project Manager';
      case 'employee': return 'Nhân viên';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân sự</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="pm">Project Manager</option>
          <option value="employee">Nhân viên</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {employee.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                  </div>
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getRoleColor(employee.role)}>
                    {getRoleText(employee.role)}
                  </Badge>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="text-blue-600">{employee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phòng ban:</span>
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày vào:</span>
                    <span>{new Date(employee.joinDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lương:</span>
                    <span>{employee.salary.toLocaleString('vi-VN')} VND</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Dự án tham gia:</p>
                  <div className="flex flex-wrap gap-1">
                    {employee.projects.map((project, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhân viên</h3>
          <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc thêm nhân viên mới.</p>
        </div>
      )}
    </div>
  );
};

export default Employees;
