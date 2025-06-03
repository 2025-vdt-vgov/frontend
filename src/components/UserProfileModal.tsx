import React, { useState } from 'react';
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
import { User, UserRole, useAuth } from '@/contexts/AuthContext';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { user, logout } = useAuth();
  
  const [formData, setFormData] = useState<Partial<User>>(
    user ? {
      fullName: user.fullName,
      username: user.username,
    } : {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user profile in a real application
    // For now we'll just close the modal
    onOpenChange(false);
  };

  // Different editable fields based on user role
  const getEditableFields = () => {
    if (!user) return [];

    // Admin can edit everything
    if (user.role === 'admin') {
      return ['fullName', 'username', 'email', 'phone', 'department', 'position'];
    }
    
    // PM can edit less
    if (user.role === 'pm') {
      return ['fullName', 'email', 'phone'];
    }
    
    // Employee can edit very little
    return ['fullName', 'phone'];
  };

  const editableFields = getEditableFields();
  
  const fieldLabels: Record<string, string> = {
    fullName: 'Họ và tên',
    username: 'Tên đăng nhập',
    email: 'Email',
    phone: 'Số điện thoại',
    department: 'Phòng ban',
    position: 'Chức vụ'
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Xem và chỉnh sửa thông tin cá nhân của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Role - always view only */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Vai trò
              </Label>
              <Input 
                id="role" 
                value={user.role === 'admin' ? 'Quản trị viên' : user.role === 'pm' ? 'Quản lý dự án' : 'Nhân viên'} 
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
          <DialogFooter>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
