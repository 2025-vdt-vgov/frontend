
import React, { useState } from 'react';
import { Key, Settings, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const PMTools = () => {
  const [tools, setTools] = useState([
    {
      id: 1,
      name: 'Asana',
      description: 'Quản lý công việc và dự án',
      logo: '🎯',
      isConnected: true,
      apiKey: 'asana_key_***************',
      lastSync: '2024-05-31 14:30',
      features: ['Task Management', 'Team Collaboration', 'Project Tracking'],
      status: 'active',
    },
    {
      id: 2,
      name: 'Jira',
      description: 'Theo dõi lỗi và quản lý dự án phần mềm',
      logo: '🔧',
      isConnected: true,
      apiKey: 'jira_key_***************',
      lastSync: '2024-05-31 13:45',
      features: ['Issue Tracking', 'Agile Boards', 'Reporting'],
      status: 'active',
    },
    {
      id: 3,
      name: 'Trello',
      description: 'Bảng kanban đơn giản và hiệu quả',
      logo: '📋',
      isConnected: false,
      apiKey: '',
      lastSync: null,
      features: ['Kanban Boards', 'Card Management', 'Team Collaboration'],
      status: 'inactive',
    },
    {
      id: 4,
      name: 'Monday.com',
      description: 'Nền tảng quản lý công việc toàn diện',
      logo: '📊',
      isConnected: false,
      apiKey: '',
      lastSync: null,
      features: ['Project Management', 'Time Tracking', 'Custom Workflows'],
      status: 'inactive',
    },
    {
      id: 5,
      name: 'Slack',
      description: 'Giao tiếp và hợp tác nhóm',
      logo: '💬',
      isConnected: true,
      apiKey: 'slack_key_***************',
      lastSync: '2024-05-31 15:00',
      features: ['Team Chat', 'File Sharing', 'Integration Hub'],
      status: 'active',
    },
  ]);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [newApiKey, setNewApiKey] = useState('');

  const handleConnect = (tool) => {
    setSelectedTool(tool);
    setNewApiKey(tool.apiKey || '');
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = () => {
    if (selectedTool && newApiKey.trim()) {
      setTools(tools.map(tool => 
        tool.id === selectedTool.id 
          ? { 
              ...tool, 
              isConnected: true, 
              apiKey: newApiKey,
              lastSync: new Date().toLocaleString('vi-VN'),
              status: 'active'
            }
          : tool
      ));
      setShowApiKeyModal(false);
      setSelectedTool(null);
      setNewApiKey('');
    }
  };

  const handleDisconnect = (toolId) => {
    setTools(tools.map(tool => 
      tool.id === toolId 
        ? { 
            ...tool, 
            isConnected: false, 
            apiKey: '',
            lastSync: null,
            status: 'inactive'
          }
        : tool
    ));
  };

  const syncData = (toolId) => {
    setTools(tools.map(tool => 
      tool.id === toolId 
        ? { 
            ...tool, 
            lastSync: new Date().toLocaleString('vi-VN')
          }
        : tool
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PM Tools Integration</h1>
          <p className="text-gray-600 mt-1">Quản lý kết nối với các công cụ quản lý dự án</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          Cài đặt tổng
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{tool.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </div>
                <Badge className={tool.isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {tool.isConnected ? 'Kết nối' : 'Chưa kết nối'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  <Switch 
                    checked={tool.isConnected} 
                    onCheckedChange={() => {
                      if (tool.isConnected) {
                        handleDisconnect(tool.id);
                      } else {
                        handleConnect(tool);
                      }
                    }}
                  />
                </div>

                {tool.isConnected && (
                  <>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>API Key:</span>
                        <span className="font-mono">{tool.apiKey}</span>
                      </div>
                      {tool.lastSync && (
                        <div className="flex justify-between mt-1">
                          <span>Đồng bộ cuối:</span>
                          <span>{tool.lastSync}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleConnect(tool)}
                        className="flex-1"
                      >
                        <Key className="w-3 h-3 mr-1" />
                        Cập nhật key
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => syncData(tool.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Đồng bộ
                      </Button>
                    </div>
                  </>
                )}

                {!tool.isConnected && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleConnect(tool)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Kết nối
                  </Button>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Tính năng:</p>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Cấu hình API Key - {selectedTool.name}</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowApiKeyModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <Input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="Nhập API key của bạn"
                  className="w-full"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Để lấy API key của {selectedTool.name}:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Đăng nhập vào tài khoản {selectedTool.name}</li>
                  <li>Vào phần Settings hoặc Developer Options</li>
                  <li>Tạo hoặc copy API key</li>
                  <li>Dán vào ô trên</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleSaveApiKey}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newApiKey.trim()}
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Hướng dẫn sử dụng</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Kết nối các công cụ PM để đồng bộ dữ liệu dự án và task</li>
          <li>• API key được mã hóa và lưu trữ an toàn</li>
          <li>• Dữ liệu được đồng bộ tự động mỗi 15 phút</li>
          <li>• Bạn có thể tắt kết nối bất kỳ lúc nào</li>
        </ul>
      </div>
    </div>
  );
};

export default PMTools;
