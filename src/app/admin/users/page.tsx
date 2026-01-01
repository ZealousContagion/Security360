"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, UserPlus, Shield, ShieldAlert, ShieldCheck, MoreHorizontal, User, Users } from "lucide-react"

export default function UsersPage() {
    const teamMembers = [
        { id: 1, name: "John Doe", email: "john@security360.com", role: "SuperAdmin", status: "Active", lastSeen: "2 mins ago" },
        { id: 2, name: "Jane Smith", email: "jane@security360.com", role: "Accountant", status: "Active", lastSeen: "1 hour ago" },
        { id: 3, name: "Sarah Connor", email: "sarah@security360.com", role: "Operations Staff", status: "Active", lastSeen: "5 hours ago" },
        { id: 4, name: "Mike Tyson", email: "mike@security360.com", role: "Viewer", status: "Inactive", lastSeen: "3 days ago" },
    ]

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "SuperAdmin": return <Badge variant="destructive" className="gap-1"><ShieldAlert className="h-3 w-3" /> {role}</Badge>
            case "Accountant": return <Badge variant="success" className="gap-1"><ShieldCheck className="h-3 w-3" /> {role}</Badge>
            default: return <Badge variant="secondary" className="gap-1"><Shield className="h-3 w-3" /> {role}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Users className="h-8 w-8" /> Team Management
                    </h2>
                    <p className="text-muted-foreground">Manage administrative access and role-based permissions.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Admins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invites</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle>Administrators</CardTitle>
                    <CardDescription>Members with access to the Security 360 Business Arena.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Admin Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Activity</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                                                {member.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <div className="font-medium">{member.name}</div>
                                                <div className="text-xs text-muted-foreground">{member.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(member.role)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${member.status === "Active" ? "bg-green-500" : "bg-slate-300"}`} />
                                            <span className="text-sm">{member.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{member.lastSeen}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
