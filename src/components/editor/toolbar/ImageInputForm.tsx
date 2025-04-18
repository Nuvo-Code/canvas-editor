import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocalImageUpload from "./LocalImageUpload";

interface ImageInputFormProps {
    addImage: (type: string, properties: any) => void;
}

export default function ImageInputForm({ addImage }: ImageInputFormProps) {
    const [imageUrl, setImageUrl] = useState("");

    const handleImageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageUrl.trim()) {
            const img = new window.Image();
            img.src = imageUrl;

            img.onload = () => {
                addImage('image', {
                    image: img,
                    width: 150,
                    height: 150
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
                                onChange={(e) => setImageUrl(e.target.value)}
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