
import React, { useState } from 'react';
import { BarChart, Users, Folder, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  const reportData = {
    projectStats: {
      total: 24,
      completed: 18,
      inProgress: 5,
      cancelled: 1,
      completionRate: 75,
    },
    employeeStats: {
      total: 156,
      active: 142,
      onLeave: 8,
      newHires: 6,
      utilization: 85,
    },
    productivity: {
      avgTasksPerEmployee: 12.5,
      avgProjectDuration: 4.2,
      clientSatisfaction: 4.6,
      budgetVariance: -2.1,
    }
  };

  const reports = [
    {
      id: 1,
      title: 'Báo cáo tiến độ dự án',
      description: 'Tổng quan về tiến độ các dự án đang thực hiện',
      type: 'project',
      lastGenerated: '2024-05-31',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Báo cáo hiệu suất nhân sự',
      description: 'Đánh giá hiệu suất làm việc của từng nhân viên',
      type: 'employee',
      lastGenerated: '2024-05-30',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Báo cáo tài chính dự án',
      description: 'Chi tiết ngân sách và chi phí các dự án',
      type: 'financial',
      lastGenerated: '2024-05-29',
      size: '3.1 MB',
    },
    {
      id: 4,
      title: 'Báo cáo khách hàng',
      description: 'Mức độ hài lòng và phản hồi từ khách hàng',
      type: 'customer',
      lastGenerated: '2024-05-28',
      size: '1.2 MB',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Tổng quan về hiệu suất và tiến độ công việc</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">Tuần này</SelectItem>
              <SelectItem value="thisMonth">Tháng này</SelectItem>
              <SelectItem value="thisQuarter">Quý này</SelectItem>
              <SelectItem value="thisYear">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.projectStats.total}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Hoàn thành: {reportData.projectStats.completed}</span>
              <Badge variant="secondary">{reportData.projectStats.completionRate}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhân sự</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.employeeStats.total}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Hoạt động: {reportData.employeeStats.active}</span>
              <Badge variant="secondary">{reportData.employeeStats.utilization}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiệu suất</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.productivity.clientSatisfaction}/5</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Hài lòng khách hàng</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Tốt
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Báo cáo có sẵn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <CardDescription className="text-sm">{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(report.lastGenerated).toLocaleDateString('vi-VN')}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Tải xuống
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích nhanh</CardTitle>
          <CardDescription>Một số chỉ số quan trọng trong kỳ báo cáo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reportData.productivity.avgTasksPerEmployee}</div>
              <p className="text-sm text-gray-600">Task/Nhân viên</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{reportData.productivity.avgProjectDuration}</div>
              <p className="text-sm text-gray-600">Tháng/Dự án</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{reportData.employeeStats.newHires}</div>
              <p className="text-sm text-gray-600">Nhân viên mới</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{reportData.productivity.budgetVariance}%</div>
              <p className="text-sm text-gray-600">Biến động ngân sách</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
