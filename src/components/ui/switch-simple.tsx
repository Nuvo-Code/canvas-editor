import React from 'react';

interface SwitchProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ 
  id, 
  checked, 
  onCheckedChange, 
  className = '' 
}) => {
  return (
    <div className={`relative inline-flex h-6 w-11 items-center rounded-full ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="peer sr-only"
      />
      <span 
        className={`absolute inset-0 rounded-full transition ${
          checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`} 
      />
      <span 
        className={`absolute inset-y-0 left-0 m-1 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} 
      />
    </div>
  );
};

export default Switch;
