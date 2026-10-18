import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '54320', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'learning_nest',
});

const transDir = 'C:/Users/joo/.gemini/antigravity-ide/brain/4ba76add-4c4c-4a98-b304-a7c9b862a731/transparent';

const plantImages = [
  { key: 'monstera_deliciosa', title: 'Monstera Deliciosa' },
  { key: 'fiddle_leaf_fig', title: 'Fiddle Leaf Fig' },
  { key: 'snake_plant_laurentii', title: 'Snake Plant Laurentii' },
  { key: 'peace_lily', title: 'Peace Lily' },
  { key: 'calathea_orbifolia', title: 'Calathea Orbifolia' },
  { key: 'zz_plant__raven_', title: "ZZ Plant 'Raven'" },
  { key: 'bird_of_paradise', title: 'Bird of Paradise' },
  { key: 'boston_fern', title: 'Boston Fern' },
  { key: 'string_of_pearls', title: 'String of Pearls' },
  { key: 'bonsai_ficus_ginseng', title: 'Bonsai Ficus Ginseng' },
];

async function updateTransparentImages() {
  await client.connect();
  console.log('Connected to database. Starting transparent PNG upload to Cloudinary...');

  const uploadedUrls = {};

  for (let i = 0; i < plantImages.length; i++) {
    const p = plantImages[i];
    const filePath = path.join(transDir, `${p.key}.png`);
    console.log(`[${i + 1}/${plantImages.length}] Uploading transparent PNG: ${p.title}...`);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'planto/products',
      public_id: `${p.key}_transparent`,
      overwrite: true,
      format: 'png',
    });

    console.log(` -> Cloudinary URL: ${result.secure_url}`);
    uploadedUrls[p.title] = result.secure_url;

    // Update in database
    await client.query(
      `UPDATE products SET images = $1 WHERE title = $2`,
      [[result.secure_url], p.title]
    );
    console.log(` -> Updated database record for "${p.title}"`);
  }

  console.log('\nAll 10 transparent plant images successfully uploaded and database updated!');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  await client.end();
}

updateTransparentImages().catch(async (err) => {
  console.error('Update failed:', err);
  await client.end().catch(() => {});
  process.exit(1);
});
