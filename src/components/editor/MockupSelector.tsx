import { useState } from 'react';
import { allMockups } from '@/lib/mockups';
import type { MockupProps } from '@/types/mockups';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface MockupSelectorProps {
  onSelectMockup: (mockup: MockupProps) => void;
  currentMockup: string;
}

export const MockupSelector = ({ onSelectMockup, currentMockup }: MockupSelectorProps) => {
  const [selectedMockup, setSelectedMockup] = useState(currentMockup);

  const handleMockupChange = (value: string) => {
    setSelectedMockup(value);
    const mockup = allMockups.find(m => m.name === value);
    if (mockup) {
      onSelectMockup(mockup.generator());
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="mockup-select">Product Template</Label>
      <Select
        value={selectedMockup}
        onValueChange={handleMockupChange}
      >
        <SelectTrigger id="mockup-select" className="w-full">
          <SelectValue placeholder="Select a mockup" />
        </SelectTrigger>
        <SelectContent>
          {allMockups.map((mockup) => (
            <SelectItem key={mockup.name} value={mockup.name}>
              {mockup.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MockupSelector;
