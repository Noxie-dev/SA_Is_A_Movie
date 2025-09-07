import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Eye, 
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
        <div className="bg-[#0A0A2A]/80 border border-[#FFA500]/30 rounded-lg max-w-md p-8 text-center">
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
        </div>
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
    <div className="bg-[#0A0A2A]/50 border border-[#FFA500]/30 rounded-lg p-6">
      <h3 className="text-xl font-bold saisa-text-yellow mb-6">Create Trending Story</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-white text-sm font-medium block mb-2">Title</label>
          <Input 
            placeholder="Enter story title"
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white w-full"
          />
        </div>
        
        <div>
          <label className="text-white text-sm font-medium block mb-2">Description</label>
          <Textarea 
            placeholder="Enter story description"
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm font-medium block mb-2">Category</label>
            <select className="bg-[#0A0A2A] border border-[#FFA500]/30 text-white rounded-md px-3 py-2 w-full">
              <option value="">Select category</option>
              <option value="music">Music</option>
              <option value="scandal">Scandal</option>
              <option value="celebrity">Celebrity</option>
              <option value="culture">Culture</option>
            </select>
          </div>
          
          <div>
            <label className="text-white text-sm font-medium block mb-2">Color Theme</label>
            <select className="bg-[#0A0A2A] border border-[#FFA500]/30 text-white rounded-md px-3 py-2 w-full">
              <option value="">Select color</option>
              <option value="saisa-text-blue">Blue</option>
              <option value="saisa-text-pink">Pink</option>
              <option value="saisa-text-yellow">Yellow</option>
              <option value="saisa-text-red">Red</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="text-white text-sm font-medium block mb-2">Content</label>
          <Textarea 
            placeholder="Write your story content in Markdown..."
            rows={8}
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white w-full"
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
      </div>
    </div>
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
            <span className="bg-[#FFA500] text-black px-3 py-1 rounded-full text-sm font-medium">
              {user?.publicMetadata?.role || 'Admin'}
            </span>
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
            <div className="bg-[#0A0A2A]/50 border border-[#FFA500]/30 rounded-lg p-6">
              <h3 className="text-xl font-bold saisa-text-yellow mb-4">About Section</h3>
              <p className="text-gray-300">About section editor coming soon...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-[#0A0A2A]/50 border border-[#FFA500]/30 rounded-lg p-6">
              <h3 className="text-xl font-bold saisa-text-yellow mb-4">Site Settings</h3>
              <p className="text-gray-300">Site settings editor coming soon...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CMSAdmin;
