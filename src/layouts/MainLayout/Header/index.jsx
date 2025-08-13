// CSS Module
import S from './style.module.css';
// Libraries
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Contexts
import { useAuth } from '../../../contexts/AuthContext';
// Components
import { Button } from '../../../components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '../../../components/ui/sheet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { User, LogOut, Settings, UserCircle, LogIn, Users, Menu } from 'lucide-react';
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
    toast.success('Mock sign in successful');
    // Navigate to booking page after mock sign in
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
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
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
    <header
      className="
        fixed top-0 left-0 right-0 z-50 w-full
        border-b border-white/10
        bg-slate-950
        bg-gradient-to-r from-purple-950 via-slate-950 to-purple-950
      "
    >     
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand + Primary Nav */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'})}}
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400" />
            <span className="text-xl font-bold text-white">Gamech</span>
          </div>

          {/* Landing links */}
          <nav className="hidden md:flex items-center gap-6">
            <a onClick={() => {navigate('/'); setTimeout(() => document.getElementById('clubs')?.scrollIntoView({behavior: 'smooth'}), 100)}} className="text-white/80 hover:text-purple-300 transition-colors cursor-pointer">
              Clubs
            </a>
            <a href="/dev/booking" className="text-white/80 hover:text-purple-300 transition-colors">
              Booking
            </a>
          </nav>
        </div>

        {/* Right side: auth (desktop) */}
        <div className="hidden md:flex items-center">
          {loading ? (
            <div className="h-10 w-20 bg-white/10 rounded-md animate-pulse" />
          ) : !location.pathname.match(/^\/sign-(up|in)$/) && !location.pathname.match(/^\/recovery\/(password|username)$/) ? (
            user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2 text-white hover:bg-white/10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-600 text-white text-sm font-semibold">
                      {getUserInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user.username}</span>
                    <span className="text-xs text-white/60">{user.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    {user.roles && user.roles.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {user.roles.map((role, i) => (
                          <span
                            key={i}
                            className="text-xs bg-purple-600/10 text-purple-600 px-1.5 py-0.5 rounded"
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
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-white border-white/20 hover:bg-white/10"
                  onClick={handleMockLogin}
                >
                  <User className="h-4 w-4" />
                  Mock Sign In
                </Button>
              )}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-white border-white/20 hover:bg-white/10"
                  onClick={handleTestApi}
                >
                  <Settings className="h-4 w-4" />
                  Test API
                </Button>
              )}
              <Button
                variant="default"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleLogin}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </div>
          )) : null}
        </div>
        
        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-950 text-white border-l border-white/10">
              <div className="mt-6 flex flex-col gap-3">
                <SheetClose asChild>
                  <button
                    className="text-left text-base py-2 px-2 rounded hover:bg-white/10"
                    onClick={() => { navigate('/'); setTimeout(() => document.getElementById('clubs')?.scrollIntoView({ behavior: 'smooth' }), 150); }}
                  >
                    Clubs
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    className="text-left text-base py-2 px-2 rounded hover:bg-white/10"
                    onClick={() => { navigate('/dev/booking') }}
                  >
                    Booking
                    </button>
                  </SheetClose>

                <div className="h-px bg-white/10 my-2" />

                {loading ? (
                  <div className="h-10 w-full bg-white/10 rounded-md animate-pulse" />
                ) : user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-purple-600 text-white text-sm font-semibold">
                          {getUserInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.username}</span>
                        <span className="text-xs text-white/60">{user.email}</span>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <button className="text-left text-base py-2 px-2 rounded hover:bg-white/10" onClick={handleMemberManagement}>
                        Member Management
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button className="text-left text-base py-2 px-2 rounded hover:bg-white/10" onClick={handleSettings}>
                        Settings
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button className="text-left text-base py-2 px-2 rounded hover:bg-white/10 text-red-400" onClick={handleLogout}>
                        Sign out
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <button
                        className="text-left text-base py-2 px-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={handleLogin}
                      >
                        <div className="flex items-center gap-2">
                          <LogIn className="h-4 w-4" /> Sign In
                        </div>
                      </button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
