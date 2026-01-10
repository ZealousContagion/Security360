import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { setSession } from '@/modules/auth/session';
import { logAction } from '@/modules/audit/logger';
import * as bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            await logAction({
                action: 'LOGIN_FAILED',
                entityType: 'User',
                performedBy: email,
            });
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ error: 'Account disabled' }, { status: 403 });
        }

        await setSession(user.id, user.role, user.email);

        await logAction({
            action: 'LOGIN_SUCCESS',
            entityType: 'User',
            entityId: user.id,
            performedBy: user.email,
            userId: user.id,
        });

        // Return user without password
        const { password: _, ...userProfile } = user;
        return NextResponse.json(userProfile);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
