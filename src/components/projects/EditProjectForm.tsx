import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projectService } from '@/services';
import { Project, UpdateProjectRequest, ProjectStatus, ProjectType } from '@/types/api';

interface EditProjectFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    project: Project | null;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
    open,
    onOpenChange,
    onSuccess,
    project
}) => {
    const [formData, setFormData] = useState<UpdateProjectRequest>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        projectStatus: ProjectStatus.PLANNING,
        projectType: ProjectType.INTERNAL,
        budget: 0
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (open && project) {
            setFormData({
                name: project.name,
                description: project.description || '',
                startDate: project.startDate || '',
                endDate: project.endDate || '',
                projectStatus: project.projectStatus,
                projectType: project.projectType,
                budget: project.budget || 0
            });
            setErrors({});
        }
    }, [open, project]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên dự án là bắt buộc';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả dự án là bắt buộc';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Ngày kết thúc là bắt buộc';
        }

        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            if (startDate >= endDate) {
                newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        if (formData.budget < 0) {
            newErrors.budget = 'Ngân sách không thể âm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!project || !validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await projectService.updateProject(project.id, formData);
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error updating project:', error);
            if (error.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else {
                setErrors({ submit: 'Đã xảy ra lỗi khi cập nhật dự án' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof UpdateProjectRequest, value: string | number | ProjectStatus | ProjectType) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa dự án</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên dự án *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Nhập tên dự án"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Nhập mô tả dự án"
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                            />
                            {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">Ngày kết thúc *</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                            />
                            {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="projectStatus">Trạng thái</Label>
                            <Select
                                value={formData.projectStatus}
                                onValueChange={(value) => handleInputChange('projectStatus', value as ProjectStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ProjectStatus.PLANNING}>Lên kế hoạch</SelectItem>
                                    <SelectItem value={ProjectStatus.IN_PROGRESS}>Đang thực hiện</SelectItem>
                                    <SelectItem value={ProjectStatus.COMPLETED}>Hoàn thành</SelectItem>
                                    <SelectItem value={ProjectStatus.CANCELLED}>Đã hủy</SelectItem>
                                    <SelectItem value={ProjectStatus.ON_HOLD}>Tạm dừng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="projectType">Loại dự án</Label>
                            <Select
                                value={formData.projectType}
                                onValueChange={(value) => handleInputChange('projectType', value as ProjectType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại dự án" />
                                </SelectTrigger>                <SelectContent>
                                    <SelectItem value={ProjectType.INTERNAL}>Nội bộ</SelectItem>
                                    <SelectItem value={ProjectType.EXTERNAL}>Bên ngoài</SelectItem>
                                    <SelectItem value={ProjectType.RESEARCH}>Nghiên cứu</SelectItem>
                                    <SelectItem value={ProjectType.MAINTENANCE}>Bảo trì</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="budget">Ngân sách (VNĐ)</Label>
                        <Input
                            id="budget"
                            type="number"
                            min="0"
                            step="1000"
                            value={formData.budget}
                            onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                            placeholder="Nhập ngân sách"
                        />
                        {errors.budget && <p className="text-sm text-red-600">{errors.budget}</p>}
                    </div>

                    {errors.submit && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {errors.submit}
                        </div>
                    )}
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditProjectForm;
