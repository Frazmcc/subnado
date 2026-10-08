const test=require('node:test');
const assert=require('node:assert/strict');
const {run}=require('../src/engine.cjs');
test('rejects malformed email addresses',async()=>{
 for(const email of ['', 'abc','a b@example.com','a@example']) {
   const result=await run({email});
   assert.equal(result.ok,false,email);
 }
});
test('returns no fabricated signup success or requests when integrations unavailable',async()=>{
 const r=await run({email:'example@example.com'});
 assert.equal(r.ok,true);
 assert.equal(r.attempted,0);
 assert.equal(r.confirmed,0);
 assert.equal(r.pending,0);
 assert.deepEqual(r.providers,[]);
});
