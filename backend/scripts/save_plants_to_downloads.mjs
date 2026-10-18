import fs from 'fs';
import path from 'path';

const dest = 'C:/Users/joo/Downloads/planto_plants';
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

const sourceDir = 'C:/Users/joo/.gemini/antigravity-ide/brain/4ba76add-4c4c-4a98-b304-a7c9b862a731';

const mapping = {
  '01_Monstera_Deliciosa.jpg': 'monstera_deliciosa_1792334649978.jpg',
  '02_Fiddle_Leaf_Fig.jpg': 'fiddle_leaf_fig_1792334673234.jpg',
  '03_Snake_Plant_Laurentii.jpg': 'snake_plant_laurentii_1792334715892.jpg',
  '04_Peace_Lily.jpg': 'peace_lily_1792334731965.jpg',
  '05_Calathea_Orbifolia.jpg': 'calathea_orbifolia_1792334751525.jpg',
  '06_ZZ_Plant_Raven.jpg': 'zz_raven_plant_1792334767250.jpg',
  '07_Bird_of_Paradise.jpg': 'bird_of_paradise_1792334794896.jpg',
  '08_Boston_Fern.jpg': 'boston_fern_1792334810475.jpg',
  '09_String_of_Pearls.jpg': 'string_of_pearls_1792334829283.jpg',
  '10_Bonsai_Ficus_Ginseng.jpg': 'bonsai_ficus_ginseng_1792334869382.jpg',
};

console.log('Copying original plant images to:', dest);

for (const [targetName, srcName] of Object.entries(mapping)) {
  const srcPath = path.join(sourceDir, srcName);
  const targetPath = path.join(dest, targetName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, targetPath);
    const stats = fs.statSync(targetPath);
    console.log(`[SAVED] ${targetName} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`[MISSING] Source: ${srcPath}`);
  }
}

console.log('All 10 original plant images successfully saved into Downloads/planto_plants!');
