import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { UserCog, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserRowActions } from './UserRowActions';
import { Role } from '@/lib/rbac';

export default async function UsersManagementPage() {
    const users = await prisma.user.findMany({
        orderBy: { role: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">User Access</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Manage system roles and dashboard permissions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        System Accounts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">User</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Actions & Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-destructive'}`} />
                                            <div className="space-y-1">
                                                <p className="font-bold uppercase text-[10px] tracking-tight">{user.name}</p>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Mail className="w-3 h-3" />
                                                    <p className="text-[9px] uppercase tracking-tighter font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <UserRowActions 
                                            userId={user.id} 
                                            currentRole={user.role as Role} 
                                            isActive={user.isActive} 
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-black text-white p-8 rounded-lg flex items-start gap-6 shadow-xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <ShieldAlert className="text-black w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Security Protocol</h4>
                    <p className="text-sm mt-3 leading-relaxed text-slate-300">
                        Access is limited by Role-Based Access Control (RBAC). <span className="text-white font-bold">ADMINS</span> have full system access, <span className="text-white font-bold">MANAGERS</span> can view financial reports and catalog settings, and <span className="text-white font-bold">USERS</span> are restricted to core operational activities.
                    </p>
                </div>
            </div>
        </div>
    );
}
