import { NextRequest, NextResponse } from 'next/server';
import { getDbUser } from '@/lib/rbac';

export async function GET(req: NextRequest) {
    const user = await getDbUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json(user);
}
