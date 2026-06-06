import React from 'react';

interface FormInputProps {
  id: string;
  placeholder: string;
  type?: 'text' | 'email' | 'textarea';
  rows?: number;
  className?: string;
}

export default function FormInput({ id, placeholder, type = 'text', rows = 3, className = '' }: FormInputProps) {
  const commonClasses = `w-full bg-[#111111] text-white text-base md:text-lg font-medium p-5 md:p-6 rounded-xl border border-white/5 focus:border-[#f04e00]/40 focus:bg-[#111111]/80 outline-none transition-colors duration-300 placeholder:text-white/30 ${className}`;

  if (type === 'textarea') {
    return <textarea id={id} placeholder={placeholder} rows={rows} className={`${commonClasses} resize-none`} />;
  }

  return <input type={type} id={id} placeholder={placeholder} className={commonClasses} />;
}
