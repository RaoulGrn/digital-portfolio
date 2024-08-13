import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={selectRef}>
      <div
        className="bg-gray-800 text-white py-2 px-4 rounded-lg border border-teal-500 focus:outline-none hover:bg-gradient-signup focus:border-teal-300 cursor-pointer text-sm"
        onClick={handleToggle}
      >
        {options.find((option) => option.value === value)?.label || "Select"}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-48 mt-2 bg-gray-800 border border-teal-500 rounded-lg shadow-lg overflow-hidden left-0">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 cursor-pointer text-gray-200  transition-all duration-300 ease-in-out relative overflow-hidden group text-sm"
              onClick={() => handleOptionClick(option.value)}
            >
              <span className="relative z-10">{option.label}</span>
              <div className="absolute inset-0 bg-gradient-signup opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
