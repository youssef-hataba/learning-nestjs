const res = await fetch('http://localhost:3001/');
const html = await res.text();
console.log('HTML length:', html.length);
const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
console.log('Style tags count:', styleMatches.length);
for (let i = 0; i < styleMatches.length; i++) {
  console.log(`Style tag ${i}:`, styleMatches[i].slice(0, 200));
}
