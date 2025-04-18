import { useState } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { ShapeType } from '../../../types/shapes';

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
  addClipart: (type: ShapeType, properties: any) => void;
}

export default function ClipartSelector({ addClipart }: ClipartSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState(clipartCategories[0].name);

  const handleClipartSelect = (url: string) => {
    // Create a new image element using a different approach
    const img = document.createElement('img');

    // Set crossOrigin to allow images from different domains
    img.crossOrigin = 'anonymous';

    // Set up error handling
    img.onerror = (err) => {
      console.error('Error loading clipart image:', err);
      alert('Failed to load the clipart image. Please try another one.');
    };

    // Set up onload handler
    img.onload = () => {
      // Create a canvas to ensure the image is fully loaded and processed
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Create a new image from the canvas
        const processedImg = new Image();
        processedImg.crossOrigin = 'anonymous';

        processedImg.onload = () => {
          // Add the clipart to the canvas
          addClipart('clipart', {
            image: processedImg,
            width: 100,
            height: 100,
            clipartType: url,
            // Add additional properties to ensure proper rendering
            fill: undefined,  // No fill for images
            stroke: undefined  // No stroke for images
          });
        };

        // Convert canvas to data URL and set as source for the processed image
        processedImg.src = canvas.toDataURL('image/png');
      } else {
        // Fallback if canvas context is not available
        addClipart('clipart', {
          image: img,
          width: 100,
          height: 100,
          clipartType: url
        });
      }
    };

    // Set the source after setting up the onload handler
    img.src = url;
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
