import type { Shape } from '../types/shapes';

export interface SavedDesign {
  id: string;
  name: string;
  shapes: Shape[];
  mockupName: string;
  createdAt: string;
  updatedAt: string;
}

export function saveDesign(name: string, shapes: Shape[], mockupName: string): SavedDesign {
  const designs = loadAllDesigns();
  
  // Create a new design or update existing one
  const now = new Date().toISOString();
  const existingDesignIndex = designs.findIndex(d => d.name === name);
  
  const design: SavedDesign = {
    id: existingDesignIndex >= 0 ? designs[existingDesignIndex].id : crypto.randomUUID(),
    name,
    shapes,
    mockupName,
    createdAt: existingDesignIndex >= 0 ? designs[existingDesignIndex].createdAt : now,
    updatedAt: now
  };
  
  if (existingDesignIndex >= 0) {
    designs[existingDesignIndex] = design;
  } else {
    designs.push(design);
  }
  
  localStorage.setItem('canvas-designer-designs', JSON.stringify(designs));
  return design;
}

export function loadDesign(id: string): SavedDesign | null {
  const designs = loadAllDesigns();
  return designs.find(design => design.id === id) || null;
}

export function loadAllDesigns(): SavedDesign[] {
  const designsJson = localStorage.getItem('canvas-designer-designs');
  if (!designsJson) return [];
  
  try {
    return JSON.parse(designsJson);
  } catch (error) {
    console.error('Failed to parse saved designs', error);
    return [];
  }
}

export function deleteDesign(id: string): boolean {
  const designs = loadAllDesigns();
  const newDesigns = designs.filter(design => design.id !== id);
  
  if (newDesigns.length === designs.length) {
    return false; // No design was deleted
  }
  
  localStorage.setItem('canvas-designer-designs', JSON.stringify(newDesigns));
  return true;
}
