import { createCatalogItem } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function NewCatalogItemPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Add Catalog Item</h1>
                <Link href="/admin/catalog">
                    <Button variant="ghost">Cancel</Button>
                </Link>
            </div>

            <Card className="p-6">
                <form action={createCatalogItem} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Item Name</label>
                        <Input name="name" placeholder="e.g. Standard Fence Post" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            required
                        >
                            <option value="Material">Material</option>
                            <option value="Labor">Labor</option>
                            <option value="Service">Service</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <Input name="price" type="number" step="0.01" placeholder="0.00" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Unit</label>
                            <select
                                name="unit"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                required
                            >
                                <option value="item">Per Item</option>
                                <option value="m">Per Meter</option>
                                <option value="hour">Per Hour</option>
                                <option value="sqm">Per Sqm</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                        <Input name="description" placeholder="Short description..." />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full">Create Item</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
