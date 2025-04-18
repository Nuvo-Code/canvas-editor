import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocalImageUploadProps {
  addImage: (type: string, properties: any) => void;
}

export default function LocalImageUpload({ addImage }: LocalImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          addImage('image', {
            image: img,
            width: 150,
            height: 150
          });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        };
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-upload">Upload from your device</Label>
        <Input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <Button 
        onClick={handleUpload}
        disabled={!selectedFile}
        className="w-full"
      >
        Upload Image
      </Button>
    </div>
  );
}
