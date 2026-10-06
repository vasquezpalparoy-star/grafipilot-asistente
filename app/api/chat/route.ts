import {businessReply,type RequestState} from '../../../lib/business-chat';
import {matchWithLuna} from '../../../lib/luna';
export function GET(){return Response.json({lunaReady:Boolean(process.env.OPENAI_API_KEY),model:'gpt-6-luna'});}
export async function POST(request:Request){
 try{const value:unknown=await request.json();const body=value&&typeof value==='object'?value as {message?:unknown;state?:unknown}:{};
 if(typeof body.message!=='string'||!body.message.trim()||body.message.length>2000)return Response.json({error:'Escribe una pregunta de hasta 2000 caracteres.'},{status:400});
 const incoming=body.state&&typeof body.state==='object'?body.state as RequestState:null;
 const state:RequestState|null=incoming?{product:typeof incoming.product==='string'?incoming.product:undefined,qty:Number.isSafeInteger(incoming.qty)&&Number(incoming.qty)>0&&Number(incoming.qty)<=1000000?incoming.qty:undefined,color:typeof incoming.color==='boolean'?incoming.color:undefined,double:typeof incoming.double==='boolean'?incoming.double:undefined}:null;
 const result=businessReply(body.message,state);
 if(result.answer.startsWith('No tengo una respuesta confirmada')){try{const matched=await matchWithLuna(body.message,state);if(matched)return Response.json({...matched,lunaConfigured:true})}catch{/* Conserva respuesta y derivación confirmadas si falla la IA. */}}
 return Response.json({...result,lunaConfigured:Boolean(process.env.OPENAI_API_KEY)});
 }catch{return Response.json({error:'No se pudo leer la solicitud.'},{status:400})}
}
