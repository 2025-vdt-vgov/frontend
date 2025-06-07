import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Users, UserCheck, UserX } from 'lucide-react';
import { employeeService, projectService } from '@/services';
import { Employee, Project } from '@/types/api';

interface ProjectEmployeeAssignmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    project: Project | null;
}

const ProjectEmployeeAssignmentModal: React.FC<ProjectEmployeeAssignmentModalProps> = ({
    open,
    onOpenChange,
    onSuccess,
    project
}) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && project) {
            fetchEmployees();
            fetchAssignedEmployees();
            setSelectedEmployeeIds(new Set());
            setSearchTerm('');
            setError(null);
        }
    }, [open, project]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await employeeService.getEmployees({ page: 0, size: 100 });
            setEmployees(response.content);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Không thể tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedEmployees = async () => {
        if (!project) return;

        try {
            const assignedList = await projectService.getProjectEmployees(project.id);
            setAssignedEmployees(assignedList);
        } catch (error) {
            console.error('Error fetching assigned employees:', error);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isEmployeeAssigned = (employeeId: number) => {
        return assignedEmployees.some(emp => emp.id === employeeId);
    };

    const handleEmployeeToggle = (employeeId: number, checked: boolean) => {
        const newSelected = new Set(selectedEmployeeIds);
        if (checked) {
            newSelected.add(employeeId);
        } else {
            newSelected.delete(employeeId);
        }
        setSelectedEmployeeIds(newSelected);
    };

    const handleAssignEmployees = async () => {
        if (!project || selectedEmployeeIds.size === 0) return;

        try {
            setSubmitLoading(true);
            const employeeIds = Array.from(selectedEmployeeIds);
            await projectService.assignEmployeesToProject(project.id, employeeIds);
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error assigning employees:', error);
            setError('Không thể phân công nhân viên. Vui lòng thử lại.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleRemoveEmployee = async (employeeId: number) => {
        if (!project) return;

        try {
            await projectService.removeEmployeeFromProject(project.id, employeeId);
            fetchAssignedEmployees(); // Refresh the assigned list
        } catch (error: any) {
            console.error('Error removing employee:', error);
            setError('Không thể xóa phân công nhân viên');
        }
    };

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Phân công nhân viên - {project.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Currently Assigned Employees */}
                    <div>
                        <Label className="text-base font-medium">Nhân viên đã phân công</Label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                            {assignedEmployees.length > 0 ? (
                                assignedEmployees.map((employee) => (
                                    <div key={employee.id} className="flex items-center justify-between p-2 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {employee.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium">{employee.name}</div>
                                                <div className="text-sm text-muted-foreground">{employee.email}</div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleRemoveEmployee(employee.id)}
                                        >
                                            <UserX className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    Chưa có nhân viên nào được phân công
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search and Assign New Employees */}
                    <div>
                        <Label className="text-base font-medium">Phân công thêm nhân viên</Label>

                        <div className="mt-2 space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm nhân viên..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {loading ? (
                                <div className="text-center py-4">Đang tải...</div>
                            ) : (
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {filteredEmployees
                                        .filter(employee => !isEmployeeAssigned(employee.id))
                                        .map((employee) => (
                                            <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg">
                                                <Checkbox
                                                    id={`employee-${employee.id}`}
                                                    checked={selectedEmployeeIds.has(employee.id)}
                                                    onCheckedChange={(checked) => handleEmployeeToggle(employee.id, checked === true)}
                                                />
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">
                                                            {employee.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium">{employee.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {employee.email} • {employee.position || 'N/A'}
                                                        </div>
                                                    </div>
                                                    {employee.role && (
                                                        <Badge variant="secondary">
                                                            {employee.role.description || employee.role.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                    {filteredEmployees.filter(employee => !isEmployeeAssigned(employee.id)).length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            {searchTerm ? 'Không tìm thấy nhân viên phù hợp' : 'Tất cả nhân viên đã được phân công'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitLoading}
                    >
                        Đóng
                    </Button>
                    {selectedEmployeeIds.size > 0 && (
                        <Button
                            onClick={handleAssignEmployees}
                            disabled={submitLoading}
                            className="gap-2"
                        >
                            <UserCheck className="w-4 h-4" />
                            {submitLoading ? 'Đang phân công...' : `Phân công ${selectedEmployeeIds.size} nhân viên`}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectEmployeeAssignmentModal;
