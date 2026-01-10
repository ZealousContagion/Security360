'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Trash2, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { createPurchaseOrder } from '../actions';

interface CatalogItem {
    id: string;
    name: string;
    price: number;
    unit: string;
}

interface Supplier {
    id: string;
    name: string;
}

interface PurchaseOrderFormProps {
    suppliers: Supplier[];
    catalogItems: CatalogItem[];
}

export default function PurchaseOrderForm({ suppliers, catalogItems }: PurchaseOrderFormProps) {
    const [supplierId, setSupplierId] = useState('');
    const [items, setItems] = useState<{ catalogItemId: string, quantity: number, unitPrice: number }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addItem = () => {
        setItems([...items, { catalogItemId: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // If changing catalogItem, auto-fill price
        if (field === 'catalogItemId') {
            const selectedItem = catalogItems.find(i => i.id === value);
            if (selectedItem) {
                newItems[index].unitPrice = Number(selectedItem.price);
            }
        }
        
        setItems(newItems);
    };

    const total = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierId || items.length === 0) return;
        
        setIsSubmitting(true);
        try {
            await createPurchaseOrder({
                supplierId,
                items: items.map(item => ({
                    catalogItemId: item.catalogItemId,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice)
                }))
            });
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Select Supplier</label>
                            <select
                                value={supplierId}
                                onChange={(e) => setSupplierId(e.target.value)}
                                className="w-full h-12 bg-accent/50 border-none rounded-lg px-4 text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="">Choose a supplier...</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Order Items</h3>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addItem}
                        className="text-[10px] uppercase font-black tracking-widest h-8"
                    >
                        <Plus className="w-3 h-3 mr-2" />
                        Add Item
                    </Button>
                </div>

                {items.map((item, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="py-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-5">
                                    <label className="block text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">Catalog Item</label>
                                    <select
                                        value={item.catalogItemId}
                                        onChange={(e) => updateItem(index, 'catalogItemId', e.target.value)}
                                        className="w-full h-10 bg-accent/30 border-none rounded px-3 text-xs font-bold uppercase"
                                        required
                                    >
                                        <option value="">Select Item</option>
                                        {catalogItems.map(ci => (
                                            <option key={ci.id} value={ci.id}>{ci.name} ({ci.unit})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">Quantity</label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                        className="h-10 text-xs font-bold"
                                        required
                                        min="0.01"
                                        step="0.01"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">Unit Price</label>
                                    <Input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                                        className="h-10 text-xs font-bold"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="md:col-span-2 text-right">
                                    <label className="block text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">Subtotal</label>
                                    <p className="h-10 flex items-center justify-end font-black text-xs">
                                        £{(item.quantity * item.unitPrice).toLocaleString()}
                                    </p>
                                </div>
                                <div className="md:col-span-1 text-right">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeItem(index)}
                                        className="text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl opacity-50">
                        <p className="text-[10px] font-black uppercase tracking-widest">No items added to this order</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center bg-black text-white p-6 rounded-xl shadow-xl">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Total Commitment</p>
                    <p className="text-3xl font-black mt-1">£{total.toLocaleString()}</p>
                </div>
                <Button 
                    type="submit" 
                    disabled={isSubmitting || !supplierId || items.length === 0}
                    className="h-14 px-8 text-xs font-black uppercase tracking-[0.2em]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Create Purchase Order
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
