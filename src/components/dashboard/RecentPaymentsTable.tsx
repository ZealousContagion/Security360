import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"

interface RecentPaymentsTableProps {
    payments?: any[];
}

export function RecentPaymentsTable({ payments = [] }: RecentPaymentsTableProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    return (
        <Table>
            <TableHeader className="bg-muted/30">
                <TableRow>
                    <TableHead className="font-bold">Invoice</TableHead>
                    <TableHead className="font-bold">Customer</TableHead>
                    <TableHead className="font-bold">Amount</TableHead>
                    <TableHead className="font-bold">Method</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                            No recent transactions recorded.
                        </TableCell>
                    </TableRow>
                ) : (
                    payments.slice(0, 5).map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="font-mono text-xs font-bold text-primary">{payment.invoiceNumber}</TableCell>
                            <TableCell>{payment.customerName || "N/A"}</TableCell>
                            <TableCell className="font-mono font-bold text-emerald-600">{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-[10px] uppercase font-bold">
                                    {payment.method}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="success" className="text-[10px] uppercase font-bold">
                                    Success
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
