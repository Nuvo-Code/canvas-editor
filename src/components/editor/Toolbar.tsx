import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Trash, Undo, Redo, Download, Image, Type, Square } from "lucide-react";

const Toolbar = ({ addText, addImage, addShape, deleteSelected, handleUndo, handleRedo, downloadDesign }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (imageUrl) {
      addImage(imageUrl);
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  return (
    <Card className="p-4 w-full space-y-4">
      <h3 className="text-lg font-bold">Design Tools</h3>
      <Separator />

      <div className="space-y-2">
        <h4 className="text-md font-semibold">Add Elements</h4>
        <Button variant="outline" onClick={addText} className="w-full flex items-center gap-2">
          <Type size={16} /> Add Text
        </Button>

        <Button variant="outline" onClick={() => setShowImageInput(!showImageInput)} className="w-full flex items-center gap-2">
          <Image size={16} /> Add Image
        </Button>
        {showImageInput && (
          <form className="flex flex-col gap-2 mt-2" onSubmit={handleImageSubmit}>
            <Input type="text" placeholder="Enter image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <Button type="submit">Add</Button>
            <Button variant="secondary" onClick={() => setShowImageInput(false)}>Cancel</Button>
            <Button variant="secondary" onClick={() => addImage()}>Use Placeholder</Button>
          </form>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Square size={16} /> Add Shape
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col space-y-2">
            <Button onClick={() => addShape("rectangle")} variant="ghost">Rectangle</Button>
            <Button onClick={() => addShape("circle")} variant="ghost">Circle</Button>
            <Button onClick={() => addShape("triangle")} variant="ghost">Triangle</Button>
          </PopoverContent>
        </Popover>
      </div>

      <Separator />
      <div className="space-y-2">
        <h4 className="text-md font-semibold">Edit</h4>
        <Button variant="destructive" onClick={deleteSelected} className="w-full flex items-center gap-2">
          <Trash size={16} /> Delete
        </Button>
      </div>

      <Separator />
      <div className="space-y-2">
        <h4 className="text-md font-semibold">History</h4>
        <Button variant="outline" onClick={handleUndo} className="w-full flex items-center gap-2">
          <Undo size={16} /> Undo
        </Button>
        <Button variant="outline" onClick={handleRedo} className="w-full flex items-center gap-2">
          <Redo size={16} /> Redo
        </Button>
      </div>

      <Separator />
      <div className="space-y-2">
        <h4 className="text-md font-semibold">Export</h4>
        <Button variant="outline" onClick={downloadDesign} className="w-full flex items-center gap-2">
          <Download size={16} /> Download
        </Button>
      </div>
    </Card>
  );
};

export default Toolbar;