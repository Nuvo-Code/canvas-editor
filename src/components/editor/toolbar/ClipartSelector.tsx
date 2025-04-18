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
      { id: "circle", url: "https://cdn-icons-png.flaticon.com/512/481/481078.png", label: "Circle" },
      { id: "square", url: "https://cdn-icons-png.flaticon.com/512/33/33714.png", label: "Square" },
      { id: "hexagon", url: "https://cdn-icons-png.flaticon.com/512/61/61333.png", label: "Hexagon" },
    ]
  },
  {
    name: "Emojis",
    items: [
      { id: "smile", url: "https://cdn-icons-png.flaticon.com/512/166/166538.png", label: "Smile" },
      { id: "laugh", url: "https://cdn-icons-png.flaticon.com/512/166/166527.png", label: "Laugh" },
      { id: "cool", url: "https://cdn-icons-png.flaticon.com/512/166/166549.png", label: "Cool" },
      { id: "wink", url: "https://cdn-icons-png.flaticon.com/512/166/166545.png", label: "Wink" },
      { id: "sad", url: "https://cdn-icons-png.flaticon.com/512/166/166527.png", label: "Sad" },
      { id: "angry", url: "https://cdn-icons-png.flaticon.com/512/166/166525.png", label: "Angry" },
    ]
  },
  {
    name: "Symbols",
    items: [
      { id: "check", url: "https://cdn-icons-png.flaticon.com/512/5290/5290058.png", label: "Check" },
      { id: "cross", url: "https://cdn-icons-png.flaticon.com/512/753/753345.png", label: "Cross" },
      { id: "arrow", url: "https://cdn-icons-png.flaticon.com/512/271/271226.png", label: "Arrow" },
      { id: "plus", url: "https://cdn-icons-png.flaticon.com/512/32/32339.png", label: "Plus" },
      { id: "minus", url: "https://cdn-icons-png.flaticon.com/512/56/56889.png", label: "Minus" },
      { id: "star-symbol", url: "https://cdn-icons-png.flaticon.com/512/1828/1828970.png", label: "Star" },
    ]
  },
  {
    name: "Animals",
    items: [
      { id: "dog", url: "https://cdn-icons-png.flaticon.com/512/616/616408.png", label: "Dog" },
      { id: "cat", url: "https://cdn-icons-png.flaticon.com/512/616/616430.png", label: "Cat" },
      { id: "bird", url: "https://cdn-icons-png.flaticon.com/512/3069/3069186.png", label: "Bird" },
      { id: "fish", url: "https://cdn-icons-png.flaticon.com/512/1998/1998627.png", label: "Fish" },
      { id: "turtle", url: "https://cdn-icons-png.flaticon.com/512/3069/3069217.png", label: "Turtle" },
      { id: "rabbit", url: "https://cdn-icons-png.flaticon.com/512/3069/3069162.png", label: "Rabbit" },
    ]
  },
  {
    name: "Food",
    items: [
      { id: "pizza", url: "https://cdn-icons-png.flaticon.com/512/599/599995.png", label: "Pizza" },
      { id: "burger", url: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", label: "Burger" },
      { id: "coffee", url: "https://cdn-icons-png.flaticon.com/512/924/924514.png", label: "Coffee" },
      { id: "ice-cream", url: "https://cdn-icons-png.flaticon.com/512/3075/3075931.png", label: "Ice Cream" },
      { id: "cake", url: "https://cdn-icons-png.flaticon.com/512/3075/3075926.png", label: "Cake" },
      { id: "fruit", url: "https://cdn-icons-png.flaticon.com/512/3075/3075929.png", label: "Fruit" },
    ]
  },
  {
    name: "Sports",
    items: [
      { id: "basketball", url: "https://cdn-icons-png.flaticon.com/512/889/889455.png", label: "Basketball" },
      { id: "football", url: "https://cdn-icons-png.flaticon.com/512/1099/1099672.png", label: "Football" },
      { id: "soccer", url: "https://cdn-icons-png.flaticon.com/512/33/33736.png", label: "Soccer" },
      { id: "tennis", url: "https://cdn-icons-png.flaticon.com/512/2151/2151193.png", label: "Tennis" },
      { id: "baseball", url: "https://cdn-icons-png.flaticon.com/512/2151/2151688.png", label: "Baseball" },
      { id: "golf", url: "https://cdn-icons-png.flaticon.com/512/2151/2151449.png", label: "Golf" },
    ]
  },
  {
    name: "Travel",
    items: [
      { id: "airplane", url: "https://cdn-icons-png.flaticon.com/512/3125/3125713.png", label: "Airplane" },
      { id: "car", url: "https://cdn-icons-png.flaticon.com/512/3125/3125796.png", label: "Car" },
      { id: "bus", url: "https://cdn-icons-png.flaticon.com/512/3125/3125923.png", label: "Bus" },
      { id: "train", url: "https://cdn-icons-png.flaticon.com/512/3125/3125877.png", label: "Train" },
      { id: "ship", url: "https://cdn-icons-png.flaticon.com/512/3125/3125912.png", label: "Ship" },
      { id: "bicycle", url: "https://cdn-icons-png.flaticon.com/512/3125/3125894.png", label: "Bicycle" },
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
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full">
            {clipartCategories.map(category => (
              <TabsTrigger key={category.name} value={category.name} className="px-4">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {clipartCategories.map(category => (
          <TabsContent key={category.name} value={category.name} className="mt-4">
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
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
                    crossOrigin="anonymous"
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
