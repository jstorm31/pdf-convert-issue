import { NextResponse } from 'next/server';
import { fromBuffer } from 'pdf2pic';

export async function POST(req: Request) {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file || file.type !== 'application/pdf') {
        return new Response(JSON.stringify({ error: 'PDF file missing' }), { status: 400 });
    }

    let buffer = Buffer.from(await file.arrayBuffer());

    const imgBuffer = await fromBuffer(buffer, {
        format: 'png',
    })(1, { responseType: 'buffer' });

    if (!imgBuffer.buffer) {
        throw new Error('Could not convert PDF to image');
    }

    return new NextResponse(Buffer.from(imgBuffer.buffer), {
        status: 200,
        headers: new Headers({
            'content-type': 'image/png',
            // 'content-disposition': 'attachment; filename=report.png',
            // 'content-length': buffer.byteLength.toString(),
            // 'cache-control': 'no-store, max-age=0',
        }),
    });
}
