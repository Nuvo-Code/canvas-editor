import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import LocalImageUpload from "./LocalImageUpload";

interface ImageInputFormProps {
    addImage: (type: 'image', properties: { image: HTMLImageElement; width: number; height: number; aspectRatio: number }) => void;
}

export default function ImageInputForm({ addImage }: ImageInputFormProps) {
    const [imageUrl, setImageUrl] = useState("");

    const handleImageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageUrl.trim()) {
            const img = new window.Image();
            img.src = imageUrl;

            img.onload = () => {
                // Calculate aspect ratio to maintain proportions
                const aspectRatio = img.width / img.height;

                // Set a target size that fits well within the design area
                // while preserving the aspect ratio
                let width, height;

                // For landscape or square images (width >= height)
                if (aspectRatio >= 1) {
                    width = Math.min(200, img.width); // Cap width at 200px or original size
                    height = width / aspectRatio;
                }
                // For portrait images (height > width)
                else {
                    height = Math.min(200, img.height); // Cap height at 200px or original size
                    width = height * aspectRatio;
                }

                addImage('image', {
                    image: img,
                    width,
                    height,
                    aspectRatio // Store the aspect ratio for future reference
                });
                setImageUrl("");
            };
        }
    };

    return (
        <div className="w-80 p-2">
            <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="mt-4">
                    <form onSubmit={handleImageSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input
                                id="image-url"
                                type="text"
                                placeholder="Enter image URL"
                                value={imageUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">Add Image</Button>
                    </form>
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                    <LocalImageUpload addImage={addImage} />
                </TabsContent>
            </Tabs>
        </div>
    );
}