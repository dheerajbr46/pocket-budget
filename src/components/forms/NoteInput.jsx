import { FileText } from 'lucide-react';
import { FormField } from './FormField.jsx';

export function NoteInput({ onChange, value }) {
  return (
    <FormField icon={FileText} label="Note">
      <input
        className="w-full bg-transparent font-semibold outline-none"
        onChange={(event) => onChange(event.target.value)}
        placeholder="What was this for?"
        value={value}
      />
    </FormField>
  );
}
