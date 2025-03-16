import type { MockupProps } from '../types/mockups'
import tshirtMockup from '@/assets/mockups/tshirt.jpg'

export function tshirt(): MockupProps {
    const image = new window.Image();
    image.src = tshirtMockup;
    return {
        name: 'T-Shirt',
        image: image,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
    }

}