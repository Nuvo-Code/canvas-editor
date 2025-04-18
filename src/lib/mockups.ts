import type { MockupProps } from '../types/mockups'
import tshirtMockup from '@/assets/mockups/tshirt.jpg'
import hoodieMockup from '@/assets/mockups/hoodie.jpg'
import mugMockup from '@/assets/mockups/mug.jpg'
import posterMockup from '@/assets/mockups/poster.jpg'
import toteMockup from '@/assets/mockups/tote.jpg'

export function createMockup(src: string, name: string): MockupProps {
    const image = new window.Image();
    image.src = src;
    return {
        name,
        image,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
    }
}

export function tshirt(): MockupProps {
    return createMockup(tshirtMockup, 'T-Shirt');
}

export function hoodie(): MockupProps {
    return createMockup(hoodieMockup, 'Hoodie');
}

export function mug(): MockupProps {
    return createMockup(mugMockup, 'Mug');
}

export function poster(): MockupProps {
    return createMockup(posterMockup, 'Poster');
}

export function tote(): MockupProps {
    return createMockup(toteMockup, 'Tote Bag');
}

export const allMockups = [
    { name: 'T-Shirt', generator: tshirt },
    { name: 'Hoodie', generator: hoodie },
    { name: 'Mug', generator: mug },
    { name: 'Poster', generator: poster },
    { name: 'Tote Bag', generator: tote }
];