import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, UserPlus, MoreVertical, Edit2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isManager, getCurrentUserRole } from "@/lib/rbac";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteTeamMemberButton } from "./DeleteTeamMemberButton";

export default async function TeamPage() {
    if (!await isManager()) {
        redirect("/admin/dashboard");
    }

    const role = await getCurrentUserRole();
    const isAdmin = role === "ADMIN";

    const members = await prisma.teamMember.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Team Members</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Manage your workforce and permissions</p>
                </div>
                <Link href="/admin/team/new">
                    <Button className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Member
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.length === 0 ? (
                    <div className="col-span-full p-12 text-center border-2 border-dashed rounded-lg border-muted uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                        No team members found.
                    </div>
                ) : members.map((member) => (
                    <Card key={member.id} className="group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
                                {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/team/${member.id}/edit`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </Link>
                                {isAdmin && (
                                    <DeleteTeamMemberButton id={member.id} name={member.name} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="font-bold uppercase text-sm tracking-tight">{member.name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-medium mt-1">{member.role}</div>
                            <div className="mt-4 flex items-center justify-between">
                                <Badge variant={member.status === 'ACTIVE' ? 'success' : 'outline'} className="uppercase text-[8px] tracking-widest px-2 py-0">
                                    {member.status}
                                </Badge>
                                <Link href={`/admin/team/${member.id}/edit`}>
                                    <Button variant="link" className="text-[9px] uppercase tracking-widest p-0 h-fit text-primary font-bold">Manage</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

