import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    event.res.statusCode = 405;
    return { error: 'Method not allowed' };
  }


  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  await fs.mkdir(uploadDir, { recursive: true });

  return new Promise((resolve) => {
    form.parse(event.req, async (err, fields, files) => {
      console.log('FIELDS:', fields);
      console.log('FILES:', files);
      if (err) {
        console.error('Upload error:', err);
        resolve({ error: 'Upload gagal: ' + err.message, detail: err });
        return;
      }
      if (!files.file) {
        resolve({ error: 'File tidak ditemukan di request', fields, files });
        return;
      }
      resolve({
        message: 'Upload berhasil',
        fields,
        files,
      });
    });
  });
});
