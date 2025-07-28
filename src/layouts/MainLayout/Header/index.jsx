// CSS Module
import S from './style.module.css';
// Libraries
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Components
import { Button } from '../../../components/ui/button';
import { User } from 'lucide-react';

function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/sign-in');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-full mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">Gamech</h1>
        </div>

        <div className="flex items-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLoginClick}
          >
            <User className="h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
