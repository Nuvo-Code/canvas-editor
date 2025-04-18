import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

// Sample size options - these would typically come from your product database
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface ProductOptionsProps {
  productName: string;
  price: number;
}

interface SizeQuantity {
  [size: string]: number;
}

export const ProductOptions = ({ productName, price }: ProductOptionsProps) => {
  // Initialize with all sizes set to 0 quantity
  const initialSizeQuantities = sizeOptions.reduce((acc, size) => {
    acc[size] = 0;
    return acc;
  }, {} as SizeQuantity);

  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity>(initialSizeQuantities);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    // Check if at least one size has a quantity > 0
    const hasItems = Object.values(sizeQuantities).some(quantity => quantity > 0);
    if (!hasItems) {
      alert('Please select at least one size and quantity');
      return;
    }

    setIsAddingToCart(true);

    // Calculate total quantity and price
    const totalQuantity = Object.values(sizeQuantities).reduce((sum, quantity) => sum + quantity, 0);
    const totalPrice = totalQuantity * price;

    // Format the order details for the alert
    const orderDetails = Object.entries(sizeQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([size, quantity]) => `${quantity} x ${size}`)
      .join(', ');

    // Simulate API call
    setTimeout(() => {
      alert(`Added to cart: ${productName} - ${orderDetails} - Total: $${totalPrice.toFixed(2)}`);
      setIsAddingToCart(false);
    }, 1000);
  };

  const incrementQuantity = (size: string) => {
    if (sizeQuantities[size] < 99) {
      setSizeQuantities({
        ...sizeQuantities,
        [size]: sizeQuantities[size] + 1
      });
    }
  };

  const decrementQuantity = (size: string) => {
    if (sizeQuantities[size] > 0) {
      setSizeQuantities({
        ...sizeQuantities,
        [size]: sizeQuantities[size] - 1
      });
    }
  };

  const handleQuantityChange = (size: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 99) {
      setSizeQuantities({
        ...sizeQuantities,
        [size]: value
      });
    }
  };

  // Calculate total items and total price
  const totalItems = Object.values(sizeQuantities).reduce((sum, quantity) => sum + quantity, 0);
  const totalAmount = totalItems * price;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg font-medium">{productName}</CardTitle>
        <div className="text-xl font-bold text-primary">${price.toFixed(2)}</div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px] font-bold">Size</TableHead>
              <TableHead className="font-bold">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizeOptions.map((size) => (
              <TableRow key={size}>
                <TableCell className="font-medium">{size}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrementQuantity(size)}
                      disabled={sizeQuantities[size] <= 0}
                      className="rounded-r-none h-8 w-8 border-primary/20"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      max="99"
                      value={sizeQuantities[size]}
                      onChange={(e) => handleQuantityChange(size, e)}
                      className="w-12 text-center rounded-none border-x-0 h-8 px-0 border-primary/20 focus:ring-primary"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => incrementQuantity(size)}
                      disabled={sizeQuantities[size] >= 99}
                      className="rounded-l-none h-8 w-8 border-primary/20"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {totalItems > 0 && (
              <TableRow className="bg-primary/10 border-t-2 border-primary/20">
                <TableCell className="font-bold text-primary">Total</TableCell>
                <TableCell className="font-bold text-primary">
                  {totalItems} items (${totalAmount.toFixed(2)})
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
          disabled={isAddingToCart || totalItems === 0}
        >
          {isAddingToCart ? 'Adding...' : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductOptions;
