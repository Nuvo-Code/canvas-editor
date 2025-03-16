import type { MockupProps } from '../types/mockups'
import tshirtMockup from '@/assets/mockups/tshirt.jpg'

export function tshirt(): MockupProps {
    return {
        name: 'T-Shirt',
        image: tshirtMockup,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
    }
}