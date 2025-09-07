import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignupButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Check if Netlify Identity is available
      if (typeof window !== 'undefined' && window.netlifyIdentity) {
        // Use Netlify Identity for signup
        const user = await window.netlifyIdentity.signup({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            full_name: formData.fullName
          }
        });

        if (user) {
          setMessage('Signup successful! You can now access the CMS.');
          setIsOpen(false);
          // Redirect to CMS after successful signup
          setTimeout(() => {
            window.location.href = '/admin/';
          }, 2000);
        }
      } else {
        // Fallback: redirect to admin with signup intent
        setMessage('Redirecting to signup...');
        setTimeout(() => {
          window.location.href = '/admin/';
        }, 1000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Signup failed. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black transition-all duration-300 px-6 py-2 rounded-xl"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#0A0A2A] border-[#FFA500]/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center saisa-text-yellow">
            Join SA IS A MOVIE
          </DialogTitle>
          <p className="text-center text-gray-400 mt-2">
            Sign up to access our content management system
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSignup} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="pl-10 bg-[#1a1a2e] border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="pl-10 bg-[#1a1a2e] border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="pl-10 bg-[#1a1a2e] border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500]"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('successful') 
                ? 'bg-green-900/50 text-green-300 border border-green-500/30' 
                : 'bg-red-900/50 text-red-300 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full saisa-bg-yellow text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400 mt-4">
          <p>Already have an account? 
            <button 
              onClick={() => {
                setIsOpen(false);
                // Trigger login modal or redirect
                window.location.href = '/admin/';
              }}
              className="text-[#FFA500] hover:text-yellow-300 ml-1 underline"
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="mt-1">
            <strong>Note:</strong> CMS access is granted based on your email domain and role assignment.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupButton;

