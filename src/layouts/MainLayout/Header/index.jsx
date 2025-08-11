// CSS Module
import S from './style.module.css';
// Libraries
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Contexts
import { useAuth } from '../../../contexts/AuthContext';
// Components
import { Button } from '../../../components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { User, LogOut, Settings, UserCircle, LogIn, Users } from 'lucide-react';
import { toast } from 'sonner';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading, mockLogin, setLoginRedirect, testApiCall } = useAuth();

  // Debug user state changes
  React.useEffect(() => {
    console.log('Header - User state changed:', { user, loading });
  }, [user, loading]);

  const handleLogin = () => {
    // Only navigate if not already on sign-in page
    if (location.pathname !== '/sign-in') {
      // Remember current page for redirect after login
      if (location.pathname !== '/' && location.pathname !== '/sign-up') {
        setLoginRedirect(location.pathname);
      }
      navigate('/sign-in');
    }
  };

  const handleMockLogin = () => {
    mockLogin();
    toast.success('Mock login successful');
    // Navigate to booking page after mock login
    setTimeout(() => {
      navigate('/booking');
    }, 1000); // Small delay to show the toast
  };

  const handleTestApi = async () => {
    const result = await testApiCall();
    if (result) {
      toast.success('API test successful - check console');
    } else {
      toast.error('API test failed - check console');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  const handleProfile = () => {
    // Navigate to profile page when available
    toast.info('Profile page coming soon');
  };

  const handleMemberManagement = () => {
    navigate('/member-management');
  };

  const handleSettings = () => {
    // Navigate to settings page when available
    toast.info('Settings page coming soon');
  };

  const getUserInitials = (username) => {
    if (!username) return 'U';
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-border backdrop-blur-sm bg-background/95">
      <div className="max-w-full mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
            Gamech
          </h1>
        </div>
        
        <div className="flex items-center">
          {loading ? (
            <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {getUserInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user.username}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {user.roles && user.roles.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {user.roles.map((role, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMemberManagement}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Member Management</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              {/* Development mock login button */}
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleMockLogin}
                >
                  <User className="h-4 w-4" />
                  Mock Login
                </Button>
              )}
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleTestApi}
                >
                  <Settings className="h-4 w-4" />
                  Test API
                </Button>
              )}
              <Button 
                variant="default" 
                className="flex items-center gap-2"
                onClick={handleLogin}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
