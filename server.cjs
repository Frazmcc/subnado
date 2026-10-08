'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {run}=require('./src/engine.cjs');
const PORT=Number(process.env.PORT)||3000;
const HTML=fs.readFileSync(path.join(__dirname,'index.html'));
const app=http.createServer(async(req,res)=>{
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  const send=(code,obj)=>{res.writeHead(code,{...headers,'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(obj));};
  if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8'});res.end(HTML);return;}
  if(req.method==='GET'&&req.url==='/api/health'){send(200,{ok:true});return;}
  if(req.method!=='POST'||req.url!=='/api/run'){send(404,{error:'Not found'});return;}
  // No newsletter requests are performed absent explicit publisher-approved authorisation.
  if(req.headers['content-type']?.split(';')[0]!=='application/json'){send(415,{error:'JSON required'});return;}
  let body='';for await(const chunk of req){body+=chunk;if(body.length>2048){send(413,{error:'Request too large'});return;}}
  let data;try{data=JSON.parse(body)}catch{send(400,{error:'Invalid JSON'});return;}
  const result=await run(data);
  send(result.ok?200:400,result);
});
if(require.main===module)app.listen(PORT,()=>console.log('Subnado listening on '+PORT));
module.exports=app;
