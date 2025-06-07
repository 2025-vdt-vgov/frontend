import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Folder, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projectService } from '@/services';
import { Project, ProjectStatus, ProjectType, PagedResponse, ProjectSearchParams } from '@/types/api';
import CreateProjectForm from '@/components/projects/CreateProjectForm';
import EditProjectForm from '@/components/projects/EditProjectForm';
import ProjectEmployeeAssignmentModal from '@/components/projects/ProjectEmployeeAssignmentModal';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const pageSize = 12;

  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchTerm, filterStatus, filterType]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams: ProjectSearchParams = {
        page: currentPage,
        size: pageSize,
        search: searchTerm
      };

      if (filterStatus !== 'all') {
        searchParams.projectStatus = filterStatus as ProjectStatus;
      }

      if (filterType !== 'all') {
        searchParams.projectType = filterType as ProjectType;
      }

      const response: PagedResponse<Project> = await projectService.getProjects(searchParams);

      setProjects(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(0); // Reset to first page when filtering
  };

  const handleTypeFilter = (value: string) => {
    setFilterType(value);
    setCurrentPage(0); // Reset to first page when filtering
  };

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      try {
        await projectService.deleteProject(projectId);
        fetchProjects(); // Refresh the list
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Không thể xóa dự án. Vui lòng thử lại.');
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditForm(true);
  };

  const handleAssignEmployees = (project: Project) => {
    setSelectedProject(project);
    setShowAssignmentModal(true);
  };

  const handleFormSuccess = () => {
    fetchProjects();
  };

  const calculateProgress = (project: Project) => {
    // Simple progress calculation based on status
    switch (project.projectStatus) {
      case ProjectStatus.COMPLETED: return 100;
      case ProjectStatus.IN_PROGRESS: return Math.floor(Math.random() * 40) + 40; // 40-80%
      case ProjectStatus.PLANNING: return Math.floor(Math.random() * 20) + 5; // 5-25%
      case ProjectStatus.ON_HOLD: return Math.floor(Math.random() * 30) + 20; // 20-50%
      case ProjectStatus.CANCELLED: return 0;
      default: return 0;
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ProjectStatus.PLANNING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ProjectStatus.ON_HOLD: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.IN_PROGRESS: return 'Đang thực hiện';
      case ProjectStatus.COMPLETED: return 'Hoàn thành';
      case ProjectStatus.PLANNING: return 'Kế hoạch';
      case ProjectStatus.ON_HOLD: return 'Tạm dừng';
      case ProjectStatus.CANCELLED: return 'Hủy bỏ';
      default: return 'Không xác định';
    }
  };

  const getTypeText = (type: ProjectType) => {
    switch (type) {
      case ProjectType.INTERNAL: return 'Nội bộ';
      case ProjectType.EXTERNAL: return 'Bên ngoài';
      case ProjectType.RESEARCH: return 'Nghiên cứu';
      case ProjectType.MAINTENANCE: return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Tìm kiếm dự án..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 ml-4" onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm dự án
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={filterStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={ProjectStatus.PLANNING}>Kế hoạch</SelectItem>
            <SelectItem value={ProjectStatus.IN_PROGRESS}>Đang thực hiện</SelectItem>
            <SelectItem value={ProjectStatus.COMPLETED}>Hoàn thành</SelectItem>
            <SelectItem value={ProjectStatus.ON_HOLD}>Tạm dừng</SelectItem>
            <SelectItem value={ProjectStatus.CANCELLED}>Hủy bỏ</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={handleTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value={ProjectType.INTERNAL}>Nội bộ</SelectItem>
            <SelectItem value={ProjectType.EXTERNAL}>Bên ngoài</SelectItem>
            <SelectItem value={ProjectType.RESEARCH}>Nghiên cứu</SelectItem>
            <SelectItem value={ProjectType.MAINTENANCE}>Bảo trì</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(pageSize)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="h-6 bg-gray-300 rounded w-32"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                  </div>
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProjects} variant="outline">
            Thử lại
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const progress = calculateProgress(project);
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Folder className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleAssignEmployees(project)} title="Phân công nhân viên">
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)} title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProject(project.id)}
                          title="Xóa"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{project.description || 'Không có mô tả'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.projectStatus)}>
                          {getStatusText(project.projectStatus)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>

                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Mã dự án:</span>
                          <span>{project.projectCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loại:</span>
                          <span>{getTypeText(project.projectType)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PM:</span>
                          <span className="text-blue-600">{project.pmEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bắt đầu:</span>
                          <span>{new Date(project.startDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {project.endDate && (
                          <div className="flex justify-between">
                            <span>Kết thúc:</span>
                            <span>{new Date(project.endDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-card-foreground mb-2">Nhóm thực hiện:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.employees && project.employees.length > 0 ? (
                            project.employees.map((employee, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {employee.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">Chưa có thành viên</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} của {totalElements} dự án
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Trước
                </Button>
                <span className="text-sm">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}

          {projects.length === 0 && !loading && (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">Không tìm thấy dự án</h3>
              <p className="text-muted-foreground">Hãy thử tìm kiếm với từ khóa khác hoặc tạo dự án mới.</p>
            </div>
          )}
        </>
      )}

      {/* Create Project Form */}
      <CreateProjectForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handleFormSuccess}
      />

      {/* Edit Project Form */}
      <EditProjectForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSuccess={handleFormSuccess}
        project={selectedProject}
      />

      {/* Project Employee Assignment Modal */}
      <ProjectEmployeeAssignmentModal
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        onSuccess={handleFormSuccess}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;