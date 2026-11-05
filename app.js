'use strict';
const $ = id => document.getElementById(id);
const levels = ['critical', 'high', 'medium', 'low'];
const names = {critical:'Crítica',high:'Alta',medium:'Media',low:'Baja'};
const catalog = [
  {id:1,name:'Audífonos',category:'audio',price:80,icon:'🎧'},
  {id:2,name:'Teclado',category:'accessories',price:120,icon:'⌨️'},
  {id:3,name:'Parlante',category:'audio',price:60,icon:'🔊'}
];
let cart = [];
let tested = false;
function state(){ return Object.fromEntries(levels.map(level => [level,$(level).checked])); }
function visibleProducts(category, bugs){return catalog.filter(p => category === 'all' || p.category === category || (bugs.medium && category === 'audio' && p.id === 2));}
function totalFor(items,bugs){return items.reduce((sum,p)=>sum+p.price,0)+(items.length && bugs.high ? 20 : 0);}
function checkoutResult(items,bugs){return !items.length ? 'empty' : bugs.critical ? 'blocked' : 'success';}
function buttonColor(bugs){return bugs.low ? '#8651be' : '#17634e';}
function message(text,kind=''){ $('shop-message').textContent=text;$('shop-message').className='shop-message '+kind; }
function renderShop(){
  const bugs=state();
  $('products').innerHTML=visibleProducts($('filter').value,bugs).map(p=>`<article class="product"><div class="product-art" aria-hidden="true">${p.icon}</div><div class="product-info"><h4>${p.name}</h4><p>S/ ${p.price.toFixed(2)}</p><button data-add="${p.id}" aria-label="Agregar ${p.name}">+ Agregar</button></div></article>`).join('');
  $('total').textContent='S/ '+totalFor(cart,bugs).toFixed(2);
  $('cart-count').textContent=cart.length+' producto'+(cart.length===1?'':'s');
  $('buy').style.backgroundColor=buttonColor(bugs);
}
// Cada prueba compara el comportamiento simulado con un resultado esperado.
function evaluate(bugs){
 const checks=[
  ['Finalizar una compra',()=>checkoutResult([catalog[0]],bugs)==='success','critical'],
  ['Total de un producto: S/ 80',()=>totalFor([catalog[0]],bugs)===80,'high'],
  ['Total de dos productos: S/ 200',()=>totalFor([catalog[0],catalog[1]],bugs)===200,'high'],
  ['Filtro Audio excluye accesorios',()=>visibleProducts('audio',bugs).every(p=>p.category==='audio'),'medium'],
  ['Filtro Audio devuelve 2 productos',()=>visibleProducts('audio',bugs).length===2,'medium'],
  ['Botón de compra con color verde',()=>buttonColor(bugs)==='#17634e','low'],
  ['Catálogo con 3 productos',()=>visibleProducts('all',bugs).length===3],
  ['Filtro Accesorios devuelve el teclado',()=>visibleProducts('accessories',bugs)[0].id===2],
  ['Filtro Accesorios devuelve 1 producto',()=>visibleProducts('accessories',bugs).length===1],
  ['Audífonos disponibles en Audio',()=>visibleProducts('audio',bugs).some(p=>p.id===1)],
  ['Parlante disponible en Audio',()=>visibleProducts('audio',bugs).some(p=>p.id===3)],
  ['Precio de audífonos: S/ 80',()=>catalog[0].price===80],
  ['Precio de teclado: S/ 120',()=>catalog[1].price===120],
  ['Precio de parlante: S/ 60',()=>catalog[2].price===60],
  ['Identificadores únicos',()=>new Set(catalog.map(p=>p.id)).size===3],
  ['Productos con nombre',()=>catalog.every(p=>p.name.length>0)],
  ['Precios mayores que cero',()=>catalog.every(p=>p.price>0)],
  ['Categorías reconocidas',()=>catalog.every(p=>['audio','accessories'].includes(p.category))],
  ['Carrito vacío con total cero',()=>totalFor([],bugs)===0],
  ['Compra vacía rechazada',()=>checkoutResult([],bugs)==='empty']
 ];
 return checks.map(([name,check,severity])=>({name,pass:check(),severity}));
}
function runTests(){
 const bugs=state(), rows=evaluate(bugs), passed=rows.filter(r=>r.pass).length, failed=rows.length-passed;
 tested=true;$('report').hidden=false;
 $('test-status').textContent='Resultados de 20 pruebas sobre la tienda simulada. La cantidad y selección de pruebas afectan el porcentaje.';
 $('pass-rate').textContent=(passed/rows.length*100).toFixed(0)+'%';$('fail-rate').textContent=(failed/rows.length*100).toFixed(0)+'%';
 $('passed').textContent=passed+' de 20 aprobaron';$('failed').textContent=failed+' de 20 fallaron';
 $('defect-count').textContent=levels.filter(l=>bugs[l]).length;
 $('pass-bar').style.width=passed/rows.length*100+'%';
 const verdict=$('verdict'); verdict.className=failed?'risk':'';
 verdict.textContent=bugs.critical ? `Compra bloqueada: ${passed/rows.length*100}% de aprobación, pero hay un defecto crítico. En este caso, la tienda no está lista para publicarse.` : failed ? 'Hay fallos pendientes. Revisa su impacto antes de publicar. La decisión depende de la severidad y de los criterios del proyecto.' : 'Las 20 pruebas aprobaron. No se detectan los cuatro defectos de esta demo. Aprobar estas pruebas no garantiza que un sistema real esté libre de errores.';
 $('formulas').textContent=`Pass Rate = (${passed} / 20) × 100 = ${passed*5}% · Fail Rate = (${failed} / 20) × 100 = ${failed*5}%`;
 $('test-rows').innerHTML=rows.map(r=>`<tr><td>${r.name}</td><td class="${r.pass?'ok':'fail'}">${r.pass?'Aprobada':'Fallida'}</td><td>${r.pass?'—':names[r.severity]}</td></tr>`).join('');
}
function invalidate(){if(tested){$('report').hidden=true;$('test-status').textContent='Cambiaste los defectos. Ejecuta las pruebas otra vez para actualizar los resultados.';tested=false;} renderShop();message('Configuración actualizada. Prueba la tienda o ejecuta las pruebas.');}
function setPreset(selected){levels.forEach(l=>$(l).checked=selected.includes(l));cart=[];$('filter').value='all';invalidate();runTests();}
function calculate(){const p=$('calc-pass').value,f=$('calc-fail').value,a=Number(p),b=Number(f),out=$('calc-result');if(p===''||f===''||!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<0||b<0||!Number.isSafeInteger(a+b)){out.textContent='Ingresa cantidades enteras, válidas y no negativas.';return;}const n=a+b;out.textContent=n===0?'Sin pruebas ejecutadas: las tasas no se pueden calcular.':`${n} ejecutadas · Pass: (${a} / ${n}) × 100 = ${(a/n*100).toLocaleString('es-PE',{maximumFractionDigits:2})}% · Fail: (${b} / ${n}) × 100 = ${(b/n*100).toLocaleString('es-PE',{maximumFractionDigits:2})}%`;}
levels.forEach(l=>$(l).addEventListener('change',invalidate));
$('filter').addEventListener('change',renderShop);
$('products').addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(!button)return;const product=catalog.find(p=>p.id===Number(button.dataset.add));cart.push(product);renderShop();message(product.name+' agregado al carrito.');});
$('buy').addEventListener('click',()=>{const result=checkoutResult(cart,state());if(result==='empty')message('Agrega un producto antes de comprar.');else if(result==='blocked')message('Error crítico: no se puede finalizar la compra.','error');else{message('Compra simulada completada por S/ '+totalFor(cart,state()).toFixed(2)+'.','success');cart=[];renderShop();}});
$('run').addEventListener('click',runTests);
$('critical-case').addEventListener('click',()=>setPreset(['critical']));
$('all-case').addEventListener('click',()=>setPreset(levels));
$('reset').addEventListener('click',()=>{levels.forEach(l=>$(l).checked=false);cart=[];tested=false;$('filter').value='all';$('report').hidden=true;$('test-status').textContent='Ejecuta las pruebas para evaluar la configuración actual.';$('calc-pass').value=85;$('calc-fail').value=15;calculate();renderShop();message('Agrega un producto para probar una compra.');});
['calc-pass','calc-fail'].forEach(id=>$(id).addEventListener('input',calculate));
renderShop();calculate();
