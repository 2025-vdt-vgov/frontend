import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, useAuth } from '@/contexts/AuthContext';
import { employeeService } from '@/services';
import { Employee, ChangePasswordRequest } from '@/types/api';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    department: '',
    position: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (open && user) {
      fetchEmployeeDetails();
    }
  }, [open, user]);

  const fetchEmployeeDetails = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const employeeData = await employeeService.getEmployeeById(parseInt(user.id));
      setEmployee(employeeData);
      setFormData({
        name: employeeData.name || '',
        phone: employeeData.phone || '',
        address: employeeData.address || '',
        department: employeeData.department || '',
        position: employeeData.position || ''
      });
    } catch (err) {
      console.error('Error fetching employee details:', err);
      setError('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !employee) return;

    try {
      setLoading(true);
      setError(null);
      
      await employeeService.updateEmployee(parseInt(user.id), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        department: formData.department,
        position: formData.position
      });
      
      onOpenChange(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const changePasswordRequest: ChangePasswordRequest = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      };
      
      await employeeService.changePassword(parseInt(user.id), changePasswordRequest);
      
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Đổi mật khẩu thành công');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Different editable fields based on user role
  const getEditableFields = () => {
    if (!user) return [];

    // Admin can edit everything
    if (user.role === 'admin') {
      return ['name', 'phone', 'address', 'department', 'position'];
    }
    
    // PM can edit less
    if (user.role === 'pm') {
      return ['name', 'phone', 'address'];
    }
    
    // Employee can edit very little
    return ['name', 'phone', 'address'];
  };

  const editableFields = getEditableFields();
  
  const fieldLabels: Record<string, string> = {
    name: 'Họ và tên',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',
    department: 'Phòng ban',
    position: 'Chức vụ'
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Xem và chỉnh sửa thông tin cá nhân của bạn.
          </DialogDescription>
        </DialogHeader>

        {loading && !employee ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : (
          <div className="space-y-4">
            {!showPasswordForm ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {/* Email - always view only */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={employee?.email || ''}
                      className="col-span-3"
                      disabled
                    />
                  </div>

                  {/* Employee Code - always view only */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Mã NV
                    </Label>
                    <Input
                      id="code"
                      value={employee?.code || ''}
                      className="col-span-3"
                      disabled
                    />
                  </div>

                  {/* Role - always view only */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Vai trò
                    </Label>
                    <Input
                      id="role"
                      value={employee?.role?.description || employee?.role?.name || 'N/A'}
                      className="col-span-3"
                      disabled
                    />
                  </div>

                  {/* Display editable and non-editable fields */}
                  {Object.keys(fieldLabels).map(field => (
                    <div key={field} className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={field} className="text-right">
                        {fieldLabels[field]}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={formData[field as keyof typeof formData] || ''}
                        onChange={handleChange}
                        className="col-span-3"
                        disabled={!editableFields.includes(field)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Đổi mật khẩu
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentPassword" className="text-right">
                      Mật khẩu hiện tại
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newPassword" className="text-right">
                      Mật khẩu mới
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirmPassword" className="text-right">
                      Xác nhận mật khẩu
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Quay lại
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
