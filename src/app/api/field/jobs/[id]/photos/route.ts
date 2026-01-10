import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDbUser } from '@/lib/rbac';
import { logAction } from '@/modules/audit/logger';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const formData = await req.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // In a real app, you would upload to S3/Cloudinary here.
        // For this implementation, we simulate a successful storage and save a mock URL.
        const mockUrl = `https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800&h=600&job=${id}`;

        const photo = await prisma.jobPhoto.create({
            data: {
                jobId: id,
                url: mockUrl,
                type: 'SITE_EVIDENCE'
            }
        });

        await logAction({
            action: 'PHOTO_UPLOADED',
            entityType: 'Job',
            entityId: id,
            performedBy: user.email,
            metadata: { photoId: photo.id }
        });

        return NextResponse.json(photo);
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
