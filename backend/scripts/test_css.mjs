const res = await fetch('http://localhost:3001/');
const html = await res.text();
const cssMatches = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map(m => m[1]);
console.log('CSS links:', cssMatches);
for (const link of cssMatches) {
  const css = await fetch('http://localhost:3001' + link).then(r => r.text());
  console.log(link, 'includes --bg-app:', css.includes('--bg-app'));
  console.log(link, 'includes #f7faf6:', css.includes('#f7faf6'));
  console.log(link, 'includes .dark:', css.includes('.dark'));
}
