export type Line={name:string;qty:number;unit:string;price:number};
export type Quote={client:string;currency:string;items:Line[];discount:number;tax:number;extra:number;notes:string};
export type Step='idle'|'client'|'currency'|'name'|'qty'|'unit'|'price'|'more'|'discount'|'tax'|'extra'|'notes'|'review';
export type Session={step:Step;quote:Quote;draft:Line};
export const fresh=():Session=>({step:'client',quote:{client:'',currency:'COP',items:[],discount:0,tax:0,extra:0,notes:''},draft:{name:'',qty:1,unit:'unidad',price:0}});
export const prompts:Record<Step,string>={idle:'Escribe «cotizar» para empezar.',client:'¿Para quién es la cotización? Escribe el nombre del cliente o empresa.',currency:'¿Qué moneda usamos? Escribe COP, USD o EUR.',name:'¿Qué servicio o producto quieres cotizar? Escribe su descripción.',qty:'¿Qué cantidad necesitas?',unit:'¿Cómo se mide? Por ejemplo: unidad, paquete, m², hora o proyecto.',price:'¿Cuál es tu precio por unidad? Puedes escribir 500, 1.500 o 1.500,50.',more:'Concepto añadido. ¿Agregamos otro servicio? Escribe sí o no.',discount:'¿Qué descuento aplicamos? Escribe el porcentaje o 0.',tax:'¿Qué impuesto aplicamos? Escribe el porcentaje o 0.',extra:'¿Hay costos adicionales, como envío? Escribe el importe o 0.',notes:'Escribe las condiciones de entrega y pago, o «sin observaciones».',review:'La cotización está lista. Escribe «imprimir» para guardar en PDF, «atrás» para corregir o «cotizar» para empezar otra.'};
export function parseNumber(text:string):number|null{
 let s=text.trim().replace(/^(?:COP|USD|EUR|\$)\s*/i,'').replace(/\s*(?:pesos|dolares|dólares|euros|COP|USD|EUR|%)$/i,'').replace(/\s/g,'');
 if(/^[+-]?\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(s))s=s.replace(/\./g,'').replace(',','.');
 else if(/^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?$/.test(s))s=s.replace(/,/g,'');
 else if(/^[+-]?\d+(?:[.,]\d{1,2})?$/.test(s))s=s.replace(',','.');else return null;
 const n=Number(s);return Number.isFinite(n)&&Math.abs(n)<=1e12?n:null;
}
export function totals(q:Quote){const subtotal=Math.round(q.items.reduce((a,i)=>a+i.qty*i.price,0)*100)/100;const discount=Math.round(subtotal*q.discount)/100;const tax=Math.round((subtotal-discount)*q.tax)/100;return {subtotal,discount,tax,total:Math.round((subtotal-discount+tax+q.extra)*100)/100}}
export function advance(current:Session,text:string):{session:Session;reply:string;accepted:boolean}{
 const s=structuredClone(current),v=text.trim(),lower=v.toLocaleLowerCase('es');const n=parseNumber(v);
 const bad=(reply:string)=>({session:current,reply,accepted:false});
 switch(s.step){
 case 'client':if(!v)return bad('Escribe el nombre del cliente.');s.quote.client=v;s.step='currency';break;
 case 'currency':{const c=lower==='pesos'?'COP':lower==='dólares'||lower==='dolares'?'USD':lower==='euros'?'EUR':v.toUpperCase();if(!['COP','USD','EUR'].includes(c))return bad('Escribe COP, USD o EUR.');s.quote.currency=c;s.step='name';break;}
 case 'name':if(!v)return bad('Escribe el servicio o producto.');s.draft.name=v;s.step='qty';break;
 case 'qty':if(n===null||n<=0)return bad('Escribe una cantidad mayor que cero, por ejemplo 100.');s.draft.qty=n;s.step='unit';break;
 case 'unit':if(!v)return bad('Escribe la unidad, por ejemplo paquete o m².');s.draft.unit=v;s.step='price';break;
 case 'price':if(n===null||n<0||n*s.draft.qty>1e12)return bad('Escribe un precio válido, mayor o igual a cero. No tengo tus tarifas y no las inventaré.');s.draft.price=n;s.quote.items.push({...s.draft});s.step='more';break;
 case 'more':if(['si','sí','s','otro'].includes(lower)){s.draft={name:'',qty:1,unit:'unidad',price:0};s.step='name';}else if(['no','n'].includes(lower))s.step='discount';else return bad('Escribe sí para otro concepto o no para continuar.');break;
 case 'discount':case 'tax':if(n===null||n<0||n>100)return bad('Escribe un porcentaje entre 0 y 100.');s.quote[s.step]=n;s.step=s.step==='discount'?'tax':'extra';break;
 case 'extra':if(n===null||n<0)return bad('Escribe un costo adicional válido o 0.');s.quote.extra=n;s.step='notes';break;
 case 'notes':s.quote.notes=['sin observaciones','ninguna','no','sin','0'].includes(lower)?'':v;s.step='review';break;
 default:return bad(prompts[s.step]);
 }
 return {session:s,reply:prompts[s.step],accepted:true};
}
