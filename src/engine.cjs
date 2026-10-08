'use strict';
const providers=Object.freeze([]);
// Providers may be added only through reviewed integrations which can establish
// recipient authorisation independently. Never build an arbitrary-address mailer.
async function run(input){
  const email=typeof input?.email==='string'?input.email.trim():'';
  if(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return {ok:false,error:'Enter a valid email address.'};
  const report={ok:true,attempted:0,confirmed:0,pending:0,skipped:0,failed:0,providers:[],message:'No authorised publisher integrations are configured. No subscription requests were sent.'};
  for(const provider of providers){
    if(typeof provider.isAuthorised!=='function'||typeof provider.subscribe!=='function')continue;
    // A string in a text field alone is never proof of authorisation.
    if(!(await provider.isAuthorised(email))) {report.skipped++;report.providers.push({name:provider.name,status:'skipped'});continue;}
    try{
      const outcome=await provider.subscribe(email);
      report.attempted++;
      const status=outcome?.status==='confirmed'?'confirmed':outcome?.status==='pending'?'pending':'failed';
      report[status]++;report.providers.push({name:provider.name,status});
    }catch{report.failed++;report.providers.push({name:provider.name,status:'failed'});}
  }
  return report;
}
module.exports={run};
