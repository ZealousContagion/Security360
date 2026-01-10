import { createTeamMember } from '../actions';
import { TeamMemberForm } from '../TeamMemberForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { checkRole } from '@/lib/rbac';

export default async function NewTeamMemberPage() {
    await checkRole(["ADMIN", "MANAGER"]);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <Link href="/admin/team" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-4 transition-colors">
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back to Team
                </Link>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Invite Member</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Add a new professional to your workforce</p>
            </div>

            <TeamMemberForm action={createTeamMember} />
        </div>
    );
}
