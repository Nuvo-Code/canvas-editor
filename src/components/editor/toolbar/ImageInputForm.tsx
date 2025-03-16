import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ImageInputForm({ addImage }: any) {
    const [imageUrl, setImageUrl] = useState("");

    const handleImageSubmit = (e) => {
        e.preventDefault();
        if (imageUrl.trim()) {
            const img = new window.Image();
            img.src = imageUrl;

            img.onload = () => {
                addImage('image', {
                    image: img,
                    width: 100,
                    height: 100
                });
                setImageUrl("");
            };
        }
    };

    return (
        <form onSubmit={handleImageSubmit} className="space-y-4">
            <Input
                type="text"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="flex justify-between space-x-2">
                <Button type="submit">Add</Button>
            </div>
        </form>
    );
}