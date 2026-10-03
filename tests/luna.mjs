import {strict as assert} from 'node:assert';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const compile=p=>ts.transpileModule(readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const url=js=>'data:text/javascript;base64,'+Buffer.from(js).toString('base64');
const business=url(compile('lib/business-chat.ts'));
const {matchWithLuna}=await import(url(compile('lib/luna.ts').replace("'./business-chat'",JSON.stringify(business))));
const oldKey=process.env.OPENAI_API_KEY,oldFetch=globalThis.fetch;
try{
 delete process.env.OPENAI_API_KEY;globalThis.fetch=()=>{throw Error('Unexpected API request without a configured key')};assert.equal(await matchWithLuna('consulta',null),null);
 process.env.OPENAI_API_KEY='test-only';
 globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert.equal(body.model,'gpt-6-luna');assert.equal(body.store,false);return Response.json({status:'completed',output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'{"faqIndex":16}'}]}]})};
 assert.ok((await matchWithLuna('cuando abren',null)).answer.includes('lunes'));
 for(const text of ['{"faqIndex":-1}','{"faqIndex":999}','{"faqIndex":1.2}','Precio inventado: 999']){globalThis.fetch=async()=>Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text}]}]});assert.equal(await matchWithLuna('consulta',null),null)}
 globalThis.fetch=async()=>new Response('Unavailable',{status:503});assert.equal(await matchWithLuna('consulta',null),null);
 console.log('Verified Luna selection, missing credentials, bounded FAQ answers, malformed responses and API error fallback. No live API calls.');
}finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=oldKey;}
