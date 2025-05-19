import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(
    option => 
      !selectedValues.includes(option) && 
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option: string) => {
    const newSelected = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    
    onChange(newSelected);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleRemoveOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(item => item !== option));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm && !filteredOptions.includes(searchTerm) && !selectedValues.includes(searchTerm)) {
      onChange([...selectedValues, searchTerm]);
      setSearchTerm('');
      e.preventDefault();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`border ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-200' : error ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white p-2 cursor-text transition-all duration-200 shadow-sm`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap gap-2">
          {selectedValues.map(value => (
            <div
              key={value}
              className="flex items-center bg-indigo-50 text-indigo-700 text-sm rounded-md px-2.5 py-1.5 shadow-sm"
            >
              <span className="mr-1.5">{value}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveOption(value, e)}
                className="text-indigo-500 hover:text-indigo-700 focus:outline-none"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedValues.length === 0 ? placeholder : ''}
            className="flex-grow min-w-[120px] py-1.5 px-2 bg-transparent border-none focus:outline-none text-sm"
          />
        </div>
        
        <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 && searchTerm ? (
            <div className="p-3 text-sm text-gray-500">
              No results. Press Enter to add "{searchTerm}".
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No options available</div>
          ) : (
            <ul className="py-1">
              {filteredOptions.map(option => (
                <li
                  key={option}
                  onClick={() => handleToggleOption(option)}
                  className="flex items-center px-4 py-2.5 text-sm hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="w-5 h-5 mr-3 border border-gray-300 rounded flex items-center justify-center">
                    {selectedValues.includes(option) && <Check size={12} className="text-indigo-600" />}
                  </div>
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
