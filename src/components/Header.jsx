import React from 'react';
import { Button } from './ui/button';
import { User } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-full mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">Gamech</h1>
        </div>

        <div className="flex items-center">
          <Button variant="outline" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
