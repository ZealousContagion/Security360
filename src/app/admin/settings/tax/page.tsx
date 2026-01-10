import { getTaxSettings, updateTaxSettings } from "@/modules/billing/tax";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { isManager } from "@/lib/rbac";

export default async function TaxSettingsPage() {
    if (!await isManager()) redirect("/admin/dashboard");
    const settings = await getTaxSettings();

    async function saveTaxSettings(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const rateStr = formData.get("rate") as string;

        const rate = parseFloat(rateStr) / 100; // Convert 15 to 0.15

        await updateTaxSettings(name, rate);
        revalidatePath("/admin/settings/tax");
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Tax & VAT Configuration</h1>

            <Card className="p-6">
                <form action={saveTaxSettings} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Tax Name
                        </label>
                        <Input
                            name="name"
                            defaultValue={settings.name}
                            placeholder="e.g. VAT, GST"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            The label that will appear on Invoices and Quotes.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Rate (%)
                        </label>
                        <Input
                            name="rate"
                            type="number"
                            step="0.01"
                            defaultValue={(settings.rate * 100).toString()}
                            placeholder="15"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Enter the percentage value (e.g. enter 14.5 for 14.5%).
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit">Save Configuration</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
