import { useState } from 'react';
import { ChevronDown, Tag } from 'lucide-react';
import { getCategoriesForType } from '../../constants/categories.js';
import { pressableStyles } from '../../constants/motion.js';
import { SelectSheet } from '../ui/SelectSheet.jsx';
import { FormField } from './FormField.jsx';

export function CategorySelect({ error, onChange, type, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const categories = getCategoriesForType(type);
  const options = categories.map((categoryName) => ({
    label: categoryName,
    value: categoryName
  }));

  return (
    <FormField error={error} icon={Tag} label="Category">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex w-full items-center justify-between gap-3 bg-transparent text-left font-semibold outline-none focus-visible:ring-2 focus-visible:ring-mint/40 ${pressableStyles}`}
      >
        <span className={value ? 'text-ink' : 'text-slate-400'}>{value || 'Select category'}</span>
        <ChevronDown size={18} className="text-slate-400" />
      </button>

      <SelectSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={onChange}
        options={options}
        title="Choose category"
        value={value}
      />
    </FormField>
  );
}
