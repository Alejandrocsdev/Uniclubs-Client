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
import { User, LogOut, Settings, UserCircle, LogIn, Users, Menu, Building2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading, setLoginRedirect } = useAuth();

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
    navigate('/profile');
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
        bg-slate-950/95 backdrop-blur-md
        bg-gradient-to-r from-purple-950/90 via-slate-950/95 to-purple-950/90
        shadow-lg shadow-purple-900/20
      "
    >     
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand + Primary Nav */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'})}}
          >
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105" />
            <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Gamech
            </span>
          </div>
        </div>

        {/* Right side: auth (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-10 w-24 bg-gradient-to-r from-white/10 to-white/5 rounded-xl animate-pulse" />
          ) : !location.pathname.match(/^\/sign-(up|in)$/) && !location.pathname.match(/^\/recovery\/(password|username)$/) ? (
            user ? (
              <>
                {/* Quick action buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="
                      text-white/80 hover:text-purple-300 hover:bg-white/10 
                      transition-all duration-200 rounded-lg px-3 py-2
                      hover:shadow-md hover:shadow-purple-500/20
                      flex items-center gap-2 group
                    "
                    onClick={() => { navigate('/'); setTimeout(() => document.getElementById('clubs')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                  >
                    <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Clubs</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="
                      text-white/80 hover:text-purple-300 hover:bg-white/10 
                      transition-all duration-200 rounded-lg px-3 py-2
                      hover:shadow-md hover:shadow-purple-500/20
                      flex items-center gap-2 group
                    "
                    onClick={() => { navigate('/dev/booking') }}
                  >
                    <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Booking</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="
                      text-white/80 hover:text-purple-300 hover:bg-white/10 
                      transition-all duration-200 rounded-lg px-3 py-2
                      hover:shadow-md hover:shadow-purple-500/20
                      flex items-center gap-2 group
                    "
                    onClick={handleMemberManagement}
                  >
                    <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Member Management</span>
                  </Button>
                </div>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="
                        flex items-center gap-3 p-2 text-white hover:bg-white/10 
                        rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-purple-500/20
                        group
                      "
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-200">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white text-sm font-semibold">
                          {getUserInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
           
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 bg-slate-900/95 backdrop-blur-md border border-white/10 shadow-2xl shadow-purple-900/30" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm font-semibold text-white">{user.username}</p>
                        <p className="text-xs text-white/60">{user.email}</p>
                        {user.roles && user.roles.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {user.roles.map((role, i) => (
                              <span
                                key={i}
                                className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={handleProfile}
                      className="
                        p-3 rounded-lg hover:bg-white/10 transition-all duration-200
                        cursor-pointer group
                      "
                    >
                      <UserCircle className="mr-3 h-4 w-4 text-purple-400 group-hover:text-purple-300" />
                      <span className="text-white">Profile ( QR Code )</span>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem 
                      onClick={handleMemberManagement}
                      className="
                        p-3 rounded-lg hover:bg-white/10 transition-all duration-200
                        cursor-pointer group
                      "
                    >
                      <Users className="mr-3 h-4 w-4 text-purple-400 group-hover:text-purple-300" />
                      <span className="text-white">Member Management</span>
                    </DropdownMenuItem> */}
                    {/* <DropdownMenuItem 
                      onClick={handleSettings}
                      className="
                        p-3 rounded-lg hover:bg-white/10 transition-all duration-200
                        cursor-pointer group
                      "
                    >
                      <Settings className="mr-3 h-4 w-4 text-purple-400 group-hover:text-purple-300" />
                      <span className="text-white">Settings</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="
                        p-3 rounded-lg hover:bg-red-500/20 transition-all duration-200
                        cursor-pointer group text-red-400 hover:text-red-300
                      "
                    >
                      <LogOut className="mr-3 h-4 w-4 group-hover:text-red-300" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  className="
                    flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 
                    hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2
                    rounded-xl font-medium shadow-lg shadow-purple-500/25 
                    hover:shadow-purple-500/40 transition-all duration-200
                    hover:scale-105
                  "
                  onClick={handleLogin}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </div>
            )
          ) : null}
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
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <button
                        className="text-left text-base py-2 px-2 rounded hover:bg-white/10 flex items-center gap-2"
                        onClick={() => { navigate('/'); setTimeout(() => document.getElementById('clubs')?.scrollIntoView({ behavior: 'smooth' }), 150); }}
                      >
                        <Building2 className="h-4 w-4" />
                        Clubs
                      </button>
                    </SheetClose>
                    {user && <SheetClose asChild>
                      <button
                        className="text-left text-base py-2 px-2 rounded hover:bg-white/10 flex items-center gap-2"
                        onClick={() => { navigate('/dev/booking') }}
                      >
                        <Calendar className="h-4 w-4" />
                        Booking
                      </button>
                    </SheetClose>}
                    {user && <SheetClose asChild>
                       <button className="text-left text-base py-2 px-2 rounded hover:bg-white/10 flex items-center gap-2" onClick={handleMemberManagement}>
                         <Users className="h-4 w-4" />
                         Member Management
                       </button>
                     </SheetClose>}
                  </div>
                </div>


                {loading ? (
                  <div className="h-10 w-full bg-white/10 rounded-md animate-pulse" />
                ) : user ? (
                  <>
                    {/* <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-purple-600 text-white text-sm font-semibold">
                          {getUserInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.username}</span>
                        <span className="text-xs text-white/60">{user.email}</span>
                      </div>
                    </div> */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex flex-col gap-2">
                        {/* <SheetClose asChild>
                          <button className="text-left text-base py-2 px-2 rounded hover:bg-white/10 flex items-center gap-2" onClick={handleSettings}>
                            <Settings className="h-4 w-4" />
                            Settings
                          </button>
                        </SheetClose> */}
                        <SheetClose asChild>
                          <button className="text-left text-base py-2 px-2 rounded hover:bg-white/10 flex items-center gap-2" onClick={handleProfile}>
                            <User className="h-4 w-4" />
                            Profile ( QR Code )
                          </button>
                        </SheetClose>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex flex-col gap-2">
                        <SheetClose asChild>
                          <button className="text-left text-base py-2 px-2 rounded hover:bg-white/10 text-red-400 flex items-center gap-2" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </SheetClose>
                      </div>
                    </div>
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
