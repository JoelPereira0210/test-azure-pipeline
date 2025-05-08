import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import axios from 'axios';
function base64ToBuffer(base64) {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}


export async function POST(req: Request, res: Response) {
    try {
        const { societyId } = await req.json(); // Get societyId from the request body
        console.log("societyId", societyId)
        if (!societyId) {
            return NextResponse.json({ error: 'Missing societyId' }, { status: 400 });
        }
        // const apiRes = await axios.post(`http://localhost:9000/api/society/${societyId}/society-manifest`);
        const apiRes = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/society/${societyId}/society-manifest`);
        console.log("API", apiRes)
        console.log("API", apiRes)
        // if (!apiRes.ok) {
        //     throw new Error('Failed to fetch manifest from Express server');
        // }

        const data: any = await apiRes.data;
        console.log("data", data)
        const manifestData = {
            name: data.society.societyName,
            short_name: data.society.shortName || data.society.societyName,
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            description: `Welcome to ${data.society.societyName}`,
            icons: [
                {
                    src: '/logo.png',  // Assuming you have a logo for the society
                    sizes: "512x512",
                    type: "image/png"
                },
                {
                    src: '/logo.png',  // Assuming you have a logo for the society
                    sizes: "192x192",
                    type: "image/png"
                },
            ]
        };
        const base64Image = data.societyLogo;
        // Convert base64 data to binary buffer
        const imageBuffer = base64ToBuffer(base64Image);
        const publicDir = path.join(process.cwd(), 'public');
        const imagePath = path.join(publicDir, 'logo.png');
        const manifestPath = path.join(__dirname, '../../../../../public/manifest.webmanifest');
        fs.writeFile(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error("Error writing manifest file:", err);
                // return NextResponse.json({ error: 'Error writing manifest file' });
            }
            return NextResponse.json({ message: 'Manifest file updated successfully' });
        });
        // Save the image to the public directory
        fs.writeFileSync(imagePath, imageBuffer);
        // return res.json("done")
        return NextResponse.json({ message: 'Logo saved successfully' });
        // const publicDir = path.join(process.cwd(), 'public');
        // const staticDir = path.join(publicDir, 'static');

        // // Ensure static directory exists
        // if (!fs.existsSync(staticDir)) {
        //     fs.mkdirSync(staticDir, { recursive: true });
        // } else {
        //     // Delete existing files in the static directory
        //     fs.readdirSync(staticDir).forEach((file) => {
        //         const filePath = path.join(staticDir, file);
        //         fs.unlinkSync(filePath);
        //     });
        // }

        // Download and save each icon
        // for (const icon of data.icons) {
        //     const iconUrl = `http://localhost:9000${icon.src}`;
        //     const response = await fetch(iconUrl);
        //     if (!response.ok) {
        //         throw new Error(`Failed to fetch ${iconUrl}`);
        //     }

        //     const buffer = await response.buffer();
        //     const filePath = path.join(publicDir, icon.src);
        //     fs.writeFileSync(filePath, buffer);
        // }

        // // Update manifest.webmanifest
        // const manifestPath = path.join(publicDir, 'manifest.webmanifest');
        // fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2), 'utf8');

        return NextResponse.json({ message: 'Manifest file updated successfully' });
    } catch (err) {
        console.error('Error updating files:', err);
        return NextResponse.json({ error: 'Failed to update files' }, { status: 500 });
    }
}
