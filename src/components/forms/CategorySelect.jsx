import { Tag } from '@phosphor-icons/react';
import { getCategoriesForType } from '../../constants/categories.js';
import { FormField } from './FormField.jsx';

export function CategorySelect({ error, onChange, type, value }) {
  const categories = getCategoriesForType(type);

  return (
    <FormField error={error} icon={Tag} label="Category">
      <select
        className="w-full bg-transparent font-semibold outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {categories.map((categoryName) => (
          <option key={categoryName}>{categoryName}</option>
        ))}
      </select>
    </FormField>
  );
}
