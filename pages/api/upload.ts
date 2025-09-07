// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), '/public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part, form) => {
        // Sanitize filename and make it unique
        const sanitizedName = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        return `${Date.now()}_${sanitizedName}${ext}`;
    }
  });

  try {
    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // The file is already saved by formidable, we just need to return its public URL
    const publicUrl = `/uploads/${file.newFilename}`;
    
    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file.' });
  }
}
