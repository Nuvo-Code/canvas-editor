import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample clipart categories and items
const clipartCategories = [
  {
    name: "Shapes",
    items: [
      { id: "heart", url: "https://cdn-icons-png.flaticon.com/512/833/833472.png", label: "Heart" },
      { id: "star", url: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", label: "Star" },
      { id: "cloud", url: "https://cdn-icons-png.flaticon.com/512/414/414927.png", label: "Cloud" },
    ]
  },
  {
    name: "Emojis",
    items: [
      { id: "smile", url: "https://cdn-icons-png.flaticon.com/512/166/166538.png", label: "Smile" },
      { id: "laugh", url: "https://cdn-icons-png.flaticon.com/512/166/166527.png", label: "Laugh" },
      { id: "cool", url: "https://cdn-icons-png.flaticon.com/512/166/166549.png", label: "Cool" },
    ]
  },
  {
    name: "Symbols",
    items: [
      { id: "check", url: "https://cdn-icons-png.flaticon.com/512/5290/5290058.png", label: "Check" },
      { id: "cross", url: "https://cdn-icons-png.flaticon.com/512/753/753345.png", label: "Cross" },
      { id: "arrow", url: "https://cdn-icons-png.flaticon.com/512/271/271226.png", label: "Arrow" },
    ]
  }
];

interface ClipartSelectorProps {
  addClipart: (type: string, properties: any) => void;
}

export default function ClipartSelector({ addClipart }: ClipartSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState(clipartCategories[0].name);

  const handleClipartSelect = (url: string) => {
    const img = new window.Image();
    img.src = url;
    
    img.onload = () => {
      addClipart('clipart', {
        image: img,
        width: 100,
        height: 100,
        clipartType: url
      });
    };
  };

  return (
    <div className="w-80 p-2">
      <Tabs 
        defaultValue={clipartCategories[0].name} 
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${clipartCategories.length}, 1fr)` }}>
          {clipartCategories.map(category => (
            <TabsTrigger key={category.name} value={category.name}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {clipartCategories.map(category => (
          <TabsContent key={category.name} value={category.name} className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {category.items.map(item => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="p-2 h-auto aspect-square flex flex-col items-center justify-center"
                  onClick={() => handleClipartSelect(item.url)}
                >
                  <img 
                    src={item.url} 
                    alt={item.label} 
                    className="w-12 h-12 object-contain mb-1" 
                  />
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
