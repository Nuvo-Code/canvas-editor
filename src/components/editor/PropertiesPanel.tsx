import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const PropertiesPanel = ({ selectedObject, updateProperty }) => {
  if (!selectedObject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>No object selected</CardContent>
      </Card>
    );
  }

  const objectType = selectedObject.type;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Position</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={Math.round(selectedObject.x)}
                onChange={(e) => updateProperty("x", parseInt(e.target.value, 10))}
              />
              <Input
                type="number"
                value={Math.round(selectedObject.y)}
                onChange={(e) => updateProperty("y", parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          {objectType !== "circle" && objectType !== "triangle" ? (
            <div>
              <Label>Size</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={Math.round(selectedObject.width)}
                  onChange={(e) => updateProperty("width", parseInt(e.target.value, 10))}
                />
                <Input
                  type="number"
                  value={Math.round(selectedObject.height)}
                  onChange={(e) => updateProperty("height", parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          ) : (
            <div>
              <Label>Radius</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.radius)}
                onChange={(e) => updateProperty("radius", parseInt(e.target.value, 10))}
              />
            </div>
          )}

          <div>
            <Label>Rotation</Label>
            <Input
              type="number"
              value={Math.round(selectedObject.rotation || 0)}
              onChange={(e) => updateProperty("rotation", parseInt(e.target.value, 10))}
            />
          </div>

          {objectType === "text" && (
            <div>
              <Label>Text</Label>
              <Input
                type="text"
                value={selectedObject.text}
                onChange={(e) => updateProperty("text", e.target.value)}
              />
              <Label>Font Size</Label>
              <Input
                type="number"
                value={selectedObject.fontSize}
                onChange={(e) => updateProperty("fontSize", parseInt(e.target.value, 10))}
              />
              <Label>Font Family</Label>
              <Select
                value={selectedObject.fontFamily}
                onValueChange={(value) => updateProperty("fontFamily", value)}
              >
                <SelectTrigger>{selectedObject.fontFamily}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                </SelectContent>
              </Select>
              <Label>Color</Label>
              <Input
                type="color"
                value={selectedObject.fill}
                onChange={(e) => updateProperty("fill", e.target.value)}
              />
            </div>
          )}

          {(objectType === "rectangle" || objectType === "circle" || objectType === "triangle") && (
            <div>
              <Label>Fill Color</Label>
              <Input
                type="color"
                value={selectedObject.fill}
                onChange={(e) => updateProperty("fill", e.target.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;
