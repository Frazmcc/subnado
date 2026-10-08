const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html','utf8');
for (const id of ['email','catalogue','permission','go','results','links']) {
  assert.match(html,new RegExp('id="'+id+'"'), 'Missing control: '+id);
}
assert.match(html,/type="email"/);
assert.match(html,/checkValidity\(\)/);
assert.match(html,/uniqueProviders\(rawNewsletters\)/);
assert.match(html,/new Set\(selected\(\)\)/);
assert.match(html,/rel='noopener noreferrer'/);
assert.match(html,/No submissions have been made by Subnado/);
assert.doesNotMatch(html,/<form[^>]+action=/i);
const urls = [...html.matchAll(/url:'(https:[^']+)'/g)].map(x=>x[1]);
assert.ok(urls.length >= 3);
assert.equal(new Set(urls).size, urls.length, 'Duplicate newsletter signup URLs');
for (const url of urls) assert.equal(new URL(url).protocol,'https:');
console.log('PASS: UI, consent, HTTPS destinations, and deduplication checks ('+urls.length+' newsletter entries).');
