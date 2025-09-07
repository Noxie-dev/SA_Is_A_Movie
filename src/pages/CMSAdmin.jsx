import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye, 
  Calendar,
  Tag,
  Image as ImageIcon,
  FileText,
  Settings
} from 'lucide-react';

const CMSAdmin = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('trending');
  const [content, setContent] = useState({
    trending: [],
    about: { title: '', subtitle: '', body: '', mission: '' },
    settings: { title: '', description: '', tagline: '' }
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check if user has admin/editor role
  const hasAccess = user?.publicMetadata?.role === 'admin' || 
                   user?.publicMetadata?.role === 'editor' ||
                   user?.emailAddresses?.[0]?.emailAddress === 'noxolokrwele64@gmail.com';

  if (!isLoaded) {
    return (
      <div className="min-h-screen saisa-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen saisa-bg flex items-center justify-center">
        <Card className="bg-[#0A0A2A]/80 border-[#FFA500]/30 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-300 mb-6">
              You don't have permission to access the CMS. Contact an administrator for access.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="saisa-bg-yellow text-black hover:bg-yellow-300"
            >
              Return to Site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'trending', label: 'Trending Stories', icon: FileText },
    { id: 'about', label: 'About Section', icon: Settings },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  const handleSave = async (type, data) => {
    try {
      // Here you would typically save to your backend or file system
      console.log('Saving:', type, data);
      
      // For now, just update local state
      if (type === 'trending') {
        setContent(prev => ({
          ...prev,
          trending: [...prev.trending, { ...data, id: Date.now() }]
        }));
      } else {
        setContent(prev => ({
          ...prev,
          [type]: { ...prev[type], ...data }
        }));
      }
      
      setIsEditing(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const TrendingForm = () => (
    <Card className="bg-[#0A0A2A]/50 border-[#FFA500]/30">
      <CardHeader>
        <CardTitle className="saisa-text-yellow">Create Trending Story</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-white text-sm font-medium">Title</label>
          <Input 
            placeholder="Enter story title"
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
          />
        </div>
        
        <div>
          <label className="text-white text-sm font-medium">Description</label>
          <Textarea 
            placeholder="Enter story description"
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm font-medium">Category</label>
            <Select>
              <SelectTrigger className="bg-[#0A0A2A] border-[#FFA500]/30 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="scandal">Scandal</SelectItem>
                <SelectItem value="celebrity">Celebrity</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-white text-sm font-medium">Color Theme</label>
            <Select>
              <SelectTrigger className="bg-[#0A0A2A] border-[#FFA500]/30 text-white">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saisa-text-blue">Blue</SelectItem>
                <SelectItem value="saisa-text-pink">Pink</SelectItem>
                <SelectItem value="saisa-text-yellow">Yellow</SelectItem>
                <SelectItem value="saisa-text-red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-white text-sm font-medium">Content</label>
          <Textarea 
            placeholder="Write your story content in Markdown..."
            rows={8}
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => handleSave('trending', {})}
            className="saisa-bg-yellow text-black hover:bg-yellow-300"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Story
          </Button>
          <Button 
            variant="outline"
            className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen saisa-bg text-white">
      {/* Header */}
      <div className="bg-[#0A0A2A]/80 backdrop-blur-sm border-b border-[#FFA500]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold saisa-text-yellow">Content Management System</h1>
              <p className="text-gray-300">Welcome back, {user?.firstName || 'Admin'}</p>
            </div>
            <Badge className="bg-[#FFA500] text-black">
              {user?.publicMetadata?.role || 'Admin'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#0A0A2A]/30 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-[#FFA500] text-black'
                  : 'text-gray-300 hover:text-white hover:bg-[#FFA500]/20'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'trending' && <TrendingForm />}
          {activeTab === 'about' && (
            <Card className="bg-[#0A0A2A]/50 border-[#FFA500]/30">
              <CardHeader>
                <CardTitle className="saisa-text-yellow">About Section</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">About section editor coming soon...</p>
              </CardContent>
            </Card>
          )}
          {activeTab === 'settings' && (
            <Card className="bg-[#0A0A2A]/50 border-[#FFA500]/30">
              <CardHeader>
                <CardTitle className="saisa-text-yellow">Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Site settings editor coming soon...</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CMSAdmin;
