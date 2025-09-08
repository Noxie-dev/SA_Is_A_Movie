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
    about: { 
      title: 'Why SA IS A MOVIE?', 
      subtitle: 'Your Ultimate Source for South African Entertainment',
      body: 'Because South Africa is literally a movie! From the drama in parliament to the beats dropping in the townships, from celebrity scandals to viral TikTok dances - we\'re here to capture it all.',
      mission: 'To be the ultimate source for South African entertainment news, keeping Mzansi talking with engaging, witty, and street-smart coverage.'
    },
    settings: { 
      title: 'SA IS A MOVIE',
      description: 'Breaking down South Africa\'s hottest scandals, celebrity drama, and Amapiano events. Your ultimate source for entertainment that keeps Mzansi talking.',
      tagline: 'LIGHTS, CAMERA, DRAMA',
      subtitle: 'Because South Africa is literally a movie!',
      social: {
        instagram: 'https://www.instagram.com/sa_isamovie?igsh=aTcyNnkzajJqejk2',
        twitter: 'https://twitter.com/sa_isamovie',
        facebook: 'https://www.facebook.com/saisamovie/',
        tiktok: 'https://www.tiktok.com/@sa_isamovie',
        youtube: 'https://youtube.com/@sa_isamovie'
      },
      stats: {
        followers: '500K+',
        monthly_views: '1M+',
        content_frequency: 'Daily'
      },
      contact: {
        email: 'legal@saisamovie.co.za',
        privacy_email: 'privacy@saisamovie.co.za',
        support_email: 'support@saisamovie.co.za'
      }
    }
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

  const AboutForm = () => (
    <div className="bg-[#0A0A2A]/50 border border-[#FFA500]/30 rounded-lg p-6">
      <h3 className="text-xl font-bold saisa-text-yellow mb-6">About Section Editor</h3>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const aboutData = {
          title: formData.get('title'),
          subtitle: formData.get('subtitle'),
          body: formData.get('body'),
          mission: formData.get('mission')
        };
        handleSave('about', aboutData);
      }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <Input
            name="title"
            defaultValue={content.about.title}
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
            placeholder="Enter about section title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
          <Input
            name="subtitle"
            defaultValue={content.about.subtitle}
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
            placeholder="Enter subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Body Content</label>
          <Textarea
            name="body"
            defaultValue={content.about.body}
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white min-h-[200px]"
            placeholder="Enter main body content (supports markdown)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mission Statement</label>
          <Textarea
            name="mission"
            defaultValue={content.about.mission}
            className="bg-[#0A0A2A] border-[#FFA500]/30 text-white min-h-[100px]"
            placeholder="Enter mission statement"
          />
        </div>
        
        <div className="flex space-x-4">
          <Button type="submit" className="saisa-bg-yellow text-black hover:bg-yellow-300">
            <Save className="h-4 w-4 mr-2" />
            Save About Section
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black"
            onClick={() => window.open('/', '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Site
          </Button>
        </div>
      </form>
    </div>
  );

  const SettingsForm = () => (
    <div className="bg-[#0A0A2A]/50 border border-[#FFA500]/30 rounded-lg p-6">
      <h3 className="text-xl font-bold saisa-text-yellow mb-6">Site Settings</h3>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const settingsData = {
          title: formData.get('title'),
          description: formData.get('description'),
          tagline: formData.get('tagline'),
          subtitle: formData.get('subtitle'),
          social: {
            instagram: formData.get('instagram'),
            twitter: formData.get('twitter'),
            facebook: formData.get('facebook'),
            tiktok: formData.get('tiktok'),
            youtube: formData.get('youtube')
          },
          stats: {
            followers: formData.get('followers'),
            monthly_views: formData.get('monthly_views'),
            content_frequency: formData.get('content_frequency')
          },
          contact: {
            email: formData.get('email'),
            privacy_email: formData.get('privacy_email'),
            support_email: formData.get('support_email')
          }
        };
        handleSave('settings', settingsData);
      }} className="space-y-6">
        {/* Basic Settings */}
        <div className="border-b border-[#FFA500]/20 pb-6">
          <h4 className="text-lg font-semibold text-[#FFA500] mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Site Title</label>
              <Input
                name="title"
                defaultValue={content.settings.title}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="Site title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
              <Input
                name="tagline"
                defaultValue={content.settings.tagline}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="Site tagline"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Textarea
              name="description"
              defaultValue={content.settings.description}
              className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
              placeholder="Site description"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="border-b border-[#FFA500]/20 pb-6">
          <h4 className="text-lg font-semibold text-[#FFA500] mb-4">Social Media Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
              <Input
                name="instagram"
                defaultValue={content.settings.social?.instagram || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter URL</label>
              <Input
                name="twitter"
                defaultValue={content.settings.social?.twitter || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Facebook URL</label>
              <Input
                name="facebook"
                defaultValue={content.settings.social?.facebook || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="https://facebook.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">TikTok URL</label>
              <Input
                name="tiktok"
                defaultValue={content.settings.social?.tiktok || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="https://tiktok.com/@username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label>
              <Input
                name="youtube"
                defaultValue={content.settings.social?.youtube || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="https://youtube.com/@username"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="border-b border-[#FFA500]/20 pb-6">
          <h4 className="text-lg font-semibold text-[#FFA500] mb-4">Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Followers</label>
              <Input
                name="followers"
                defaultValue={content.settings.stats?.followers || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="500K+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Views</label>
              <Input
                name="monthly_views"
                defaultValue={content.settings.stats?.monthly_views || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="1M+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content Frequency</label>
              <Input
                name="content_frequency"
                defaultValue={content.settings.stats?.content_frequency || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="Daily"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold text-[#FFA500] mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Legal Email</label>
              <Input
                name="email"
                defaultValue={content.settings.contact?.email || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="legal@saisamovie.co.za"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Privacy Email</label>
              <Input
                name="privacy_email"
                defaultValue={content.settings.contact?.privacy_email || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="privacy@saisamovie.co.za"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
              <Input
                name="support_email"
                defaultValue={content.settings.contact?.support_email || ''}
                className="bg-[#0A0A2A] border-[#FFA500]/30 text-white"
                placeholder="support@saisamovie.co.za"
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 pt-6">
          <Button type="submit" className="saisa-bg-yellow text-black hover:bg-yellow-300">
            <Save className="h-4 w-4 mr-2" />
            Save Site Settings
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black"
            onClick={() => window.open('/', '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Site
          </Button>
        </div>
      </form>
    </div>
  );

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
          {activeTab === 'about' && <AboutForm />}
          {activeTab === 'settings' && <SettingsForm />}
        </motion.div>
      </div>
    </div>
  );
};

export default CMSAdmin;
