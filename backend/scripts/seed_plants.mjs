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

const artifactsDir = 'C:/Users/joo/.gemini/antigravity-ide/brain/4ba76add-4c4c-4a98-b304-a7c9b862a731';

const plants = [
  {
    title: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    description: 'A stunning tropical icon known for its vibrant glossy heart-shaped leaves that develop natural perforations (fenestrations) as it matures. An architectural centerpiece that thrives indoors and purifies living spaces.',
    price: 48,
    stock: 15,
    placement: 'INDOOR',
    lightRequirement: 'INDIRECT_BRIGHT',
    wateringFrequency: 'MODERATE',
    careLevel: 'EASY',
    isPetFriendly: false,
    humidity: '60-80%',
    potSize: '22cm',
    category: 'Houseplants',
    imageFile: path.join(artifactsDir, 'monstera_deliciosa_1792334649978.jpg'),
  },
  {
    title: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    description: 'Celebrated for its majestic, violin-shaped broad leaves and deep emerald luster. An interior designer favorite that makes an imposing sculptural statement in brightly lit corners and high-ceiling rooms.',
    price: 72,
    stock: 8,
    placement: 'INDOOR',
    lightRequirement: 'INDIRECT_BRIGHT',
    wateringFrequency: 'MODERATE',
    careLevel: 'MODERATE',
    isPetFriendly: false,
    humidity: '50-70%',
    potSize: '26cm',
    category: 'Indoor Trees',
    imageFile: path.join(artifactsDir, 'fiddle_leaf_fig_1792334673234.jpg'),
  },
  {
    title: 'Snake Plant Laurentii',
    scientificName: "Sansevieria trifasciata 'Laurentii'",
    description: 'An architectural powerhouse featuring upright sword-shaped succulent leaves edged with vibrant golden-yellow bands. Renowned for NASA-proven air purification and nearly indestructible resilience.',
    price: 34,
    stock: 25,
    placement: 'BOTH',
    lightRequirement: 'LOW_LIGHT',
    wateringFrequency: 'LOW',
    careLevel: 'EASY',
    isPetFriendly: false,
    humidity: '30-50%',
    potSize: '18cm',
    category: 'Air Purifying',
    imageFile: path.join(artifactsDir, 'snake_plant_laurentii_1792334715892.jpg'),
  },
  {
    title: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    description: 'Elegant tropical perennial featuring glossy dark green foliage and magnificent pure white flowering spathes. Signals its thirst by gently drooping, making it one of the easiest and most communicative flowering houseplants.',
    price: 38,
    stock: 20,
    placement: 'INDOOR',
    lightRequirement: 'LOW_LIGHT',
    wateringFrequency: 'HIGH',
    careLevel: 'EASY',
    isPetFriendly: false,
    humidity: '60-80%',
    potSize: '19cm',
    category: 'Flowering',
    imageFile: path.join(artifactsDir, 'peace_lily_1792334731965.jpg'),
  },
  {
    title: 'Calathea Orbifolia',
    scientificName: 'Goeppertia orbifolia',
    description: 'A rare botanical gem showcasing oversized, orb-like leaves adorned with delicate metallic silver and emerald pinstripes. A pet-friendly, non-toxic prayer plant that folds its foliage gracefully at nightfall.',
    price: 42,
    stock: 12,
    placement: 'INDOOR',
    lightRequirement: 'INDIRECT_BRIGHT',
    wateringFrequency: 'MODERATE',
    careLevel: 'MODERATE',
    isPetFriendly: true,
    humidity: '65-85%',
    potSize: '17cm',
    category: 'Pet-Friendly',
    imageFile: path.join(artifactsDir, 'calathea_orbifolia_1792334751525.jpg'),
  },
  {
    title: "ZZ Plant 'Raven'",
    scientificName: "Zamioculcas zamiifolia 'Raven'",
    description: 'An exotic cultivar prized for its glossy feathered foliage that emerges bright lime green and matures into an opulent, obsidian-black shade. Extremely drought-tolerant and thrives even in low-light conditions.',
    price: 52,
    stock: 14,
    placement: 'INDOOR',
    lightRequirement: 'LOW_LIGHT',
    wateringFrequency: 'LOW',
    careLevel: 'EASY',
    isPetFriendly: false,
    humidity: '40-60%',
    potSize: '16cm',
    category: 'Rare & Exotic',
    imageFile: path.join(artifactsDir, 'zz_raven_plant_1792334767250.jpg'),
  },
  {
    title: 'Bird of Paradise',
    scientificName: 'Strelitzia nicolai',
    description: 'The quintessential tropical statement plant boasting enormous banana-like leaves arranged in a grand sculptural fan. Brings an instant luxury resort ambiance to any bright, sun-drenched interior.',
    price: 85,
    stock: 6,
    placement: 'INDOOR',
    lightRequirement: 'DIRECT_SUN',
    wateringFrequency: 'MODERATE',
    careLevel: 'MODERATE',
    isPetFriendly: false,
    humidity: '60-70%',
    potSize: '30cm',
    category: 'Tropical Giants',
    imageFile: path.join(artifactsDir, 'bird_of_paradise_1792334794896.jpg'),
  },
  {
    title: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    description: 'A timeless Victorian classic with lush arching fronds composed of delicate, feathery leaflets. Safe for curious cats and dogs, and acts as a natural room humidifier and air purifier.',
    price: 29,
    stock: 22,
    placement: 'INDOOR',
    lightRequirement: 'INDIRECT_BRIGHT',
    wateringFrequency: 'HIGH',
    careLevel: 'EASY',
    isPetFriendly: true,
    humidity: '70-90%',
    potSize: '18cm',
    category: 'Hanging Plants',
    imageFile: path.join(artifactsDir, 'boston_fern_1792334810475.jpg'),
  },
  {
    title: 'String of Pearls',
    scientificName: 'Senecio rowleyanus',
    description: 'A mesmerizing trailing succulent with cascading strings of plump, pea-shaped beads designed to store water in arid climates. Creates a dramatic waterfall effect when placed on high shelves or hanging macrame.',
    price: 26,
    stock: 24,
    placement: 'INDOOR',
    lightRequirement: 'INDIRECT_BRIGHT',
    wateringFrequency: 'LOW',
    careLevel: 'MODERATE',
    isPetFriendly: false,
    humidity: '30-50%',
    potSize: '14cm',
    category: 'Succulents & Cacti',
    imageFile: path.join(artifactsDir, 'string_of_pearls_1792334829283.jpg'),
  },
  {
    title: 'Bonsai Ficus Ginseng',
    scientificName: "Ficus microcarpa 'Ginseng'",
    description: 'A living work of art featuring thick, sculptural exposed aerial roots reminiscent of ginseng tubers, crowned with a dense canopy of glossy oval leaves. Highly durable and perfect for bonsai beginners and zen decor.',
    price: 64,
    stock: 10,
    placement: 'INDOOR',
    lightRequirement: 'INDIRECT_BRIGHT',
    wateringFrequency: 'MODERATE',
    careLevel: 'EASY',
    isPetFriendly: false,
    humidity: '50-70%',
    potSize: '20cm',
    category: 'Bonsai',
    imageFile: path.join(artifactsDir, 'bonsai_ficus_ginseng_1792334869382.jpg'),
  },
];

async function seed() {
  console.log('Connecting to database...');
  await client.connect();

  const adminUserId = 'a1111111-1111-4111-8111-111111111111';

  console.log(`Starting Cloudinary upload and database seeding for ${plants.length} botanical products...`);

  for (let i = 0; i < plants.length; i++) {
    const p = plants[i];
    console.log(`[${i + 1}/${plants.length}] Uploading image for: ${p.title}...`);

    let imageUrl = '';
    try {
      const uploadResult = await cloudinary.uploader.upload(p.imageFile, {
        folder: 'planto/products',
        public_id: p.title.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        overwrite: true,
      });
      imageUrl = uploadResult.secure_url;
      console.log(` -> Uploaded to Cloudinary: ${imageUrl}`);
    } catch (uploadErr) {
      console.error(` -> Failed to upload ${p.title} to Cloudinary:`, uploadErr.message);
      throw uploadErr;
    }

    const insertQuery = `
      INSERT INTO products (
        title,
        description,
        price,
        "userId",
        images,
        "scientificName",
        stock,
        placement,
        "lightRequirement",
        "wateringFrequency",
        "careLevel",
        "isPetFriendly",
        humidity,
        "potSize",
        category,
        "createdAt",
        "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()
      ) RETURNING id, title;
    `;

    const values = [
      p.title,
      p.description,
      p.price,
      adminUserId,
      [imageUrl],
      p.scientificName,
      p.stock,
      p.placement,
      p.lightRequirement,
      p.wateringFrequency,
      p.careLevel,
      p.isPetFriendly,
      p.humidity,
      p.potSize,
      p.category,
    ];

    const res = await client.query(insertQuery, values);
    console.log(` -> Seeded into database with ID: ${res.rows[0].id}`);
  }

  console.log('\nAll 10 plants successfully uploaded to Cloudinary and seeded into PostgreSQL!');
  await client.end();
}

seed().catch(async (err) => {
  console.error('Seeding failed:', err);
  await client.end().catch(() => {});
  process.exit(1);
});
