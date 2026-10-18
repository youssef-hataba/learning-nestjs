import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

const downloadsDir = 'C:\\Users\\joo\\Downloads\\planto_plants';
const publicPlantsDir = path.resolve(__dirname, '../../frontend/public/plants');

// Precise visual botanical mapping
const plantMappings = [
  {
    title: 'Monstera Deliciosa',
    file: 'ecom_Pearls.png',
    publicId: 'monstera_deliciosa_transparent',
    localName: 'monstera.png',
  },
  {
    title: 'Fiddle Leaf Fig',
    file: 'ecom_Snake.png',
    publicId: 'fiddle_leaf_fig_transparent',
    localName: 'fiddle-leaf-fig.png',
  },
  {
    title: 'Snake Plant Laurentii',
    file: 'ecom_Calathea.png',
    publicId: 'snake_plant_laurentii_transparent',
    localName: 'snake-plant.png',
  },
  {
    title: 'Peace Lily',
    file: 'ecom_Fiddle.png',
    publicId: 'peace_lily_transparent',
    localName: 'peace-lily.png',
  },
  {
    title: 'Calathea Orbifolia',
    file: 'ecom_Bonsai.png',
    publicId: 'calathea_orbifolia_transparent',
    localName: 'calathea.png',
  },
  {
    title: "ZZ Plant 'Raven'",
    file: 'ecom_Peace.png',
    publicId: 'zz_plant_raven_transparent',
    localName: 'zz-plant-raven.png',
  },
  {
    title: 'Bird of Paradise',
    file: 'ecom_Boston.png',
    publicId: 'bird_of_paradise_transparent',
    localName: 'bird-of-paradise.png',
  },
  {
    title: 'Boston Fern',
    file: 'ecom_Monstera.png',
    publicId: 'boston_fern_transparent',
    localName: 'boston-fern.png',
  },
  {
    title: 'String of Pearls',
    file: 'ecom_Bird.png',
    publicId: 'string_of_pearls_transparent',
    localName: 'string-of-pearls.png',
  },
  {
    title: 'Bonsai Ficus Ginseng',
    file: 'ecom_ZZ.png',
    publicId: 'bonsai_ficus_ginseng_transparent',
    localName: 'bonsai-ficus.png',
  },
];

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL.');

  if (!fs.existsSync(publicPlantsDir)) {
    fs.mkdirSync(publicPlantsDir, { recursive: true });
  }

  const results = {};

  for (let i = 0; i < plantMappings.length; i++) {
    const item = plantMappings[i];
    const filePath = path.join(downloadsDir, item.file);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    // 1. Copy to frontend public/plants
    const localDest = path.join(publicPlantsDir, item.localName);
    fs.copyFileSync(filePath, localDest);
    console.log(`Copied ${item.file} -> frontend/public/plants/${item.localName}`);

    // 2. Upload to Cloudinary with unique version timestamp
    console.log(`[${i + 1}/${plantMappings.length}] Uploading ${item.file} for "${item.title}"...`);
    const uploadRes = await cloudinary.uploader.upload(filePath, {
      folder: 'planto/products',
      public_id: item.publicId,
      overwrite: true,
      format: 'png',
    });

    console.log(` -> Cloudinary URL: ${uploadRes.secure_url}`);
    results[item.title] = uploadRes.secure_url;

    // 3. Update database
    await client.query(
      `UPDATE products SET images = $1 WHERE title = $2`,
      [[uploadRes.secure_url], item.title]
    );
    console.log(` -> Updated database record for "${item.title}"`);
  }

  console.log('\nAll plant images mapped, uploaded & database updated successfully!');
  console.log(JSON.stringify(results, null, 2));

  await client.end();
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
