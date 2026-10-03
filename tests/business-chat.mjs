import {strict as assert} from 'node:assert';
import {businessReply} from '../lib/business-chat.ts';
for(const [query,part] of [['que horaro tienen','lunes'],['donde estan ubicados','UNHEVAL'],['aceptan yape','Yape'],['hacen plastificado','enmicado'],['cuanto tarda el delivery','1 y 3 horas'],['puedo mandar pdf','PDF'],['hacen tesis','No realizamos'],['me hacen descuento por volumen','mínimo mayorista']]){assert.ok(businessReply(query).answer.includes(part),query+': '+businessReply(query).answer)}
for(const [query,total] of [['20 hojas A4 a color a una cara',2],['100 A3 blanco y negro ambas caras',50],['3 anillados',4.5],['2 hojas A0 color una cara',8]]){const r=businessReply(query);assert.ok(r.quote,query+': '+r.answer);assert.equal(r.quote.currency,'PEN');assert.equal(r.quote.items[0].qty*r.quote.items[0].price,total)}
assert.ok(businessReply('2 hojas A2 a color ambas caras').answer.includes('no está disponible'));
assert.ok(businessReply('10 hojas A4 a color una cara por mayor').handoff);assert.equal(businessReply('10 hojas A4 a color una cara por mayor').quote,undefined);
assert.ok(businessReply('cotiza un banner').handoff);
assert.ok(businessReply('cotiza 10 hojas A4 opalina color una cara').handoff);
assert.ok(businessReply('que tiempo hace en paris').handoff);
let r=businessReply('cotizar');r=businessReply('A4',r.state);r=businessReply('20',r.state);r=businessReply('color',r.state);r=businessReply('ambas caras',r.state);assert.equal(r.quote.items[0].price,.12);assert.equal(r.state,null);
console.log('Verified FAQs, paraphrases, typos, catalog calculations, missing/zero rates, wholesale and guided conversation.');
