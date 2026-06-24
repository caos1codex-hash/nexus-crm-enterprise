// Standalone data generator - no type imports needed
const fs = require('fs');
const path = require('path');

const COMPANIES = [
  { name: 'Banco Santander', sector: 'Financiero', city: 'Ciudad de México', country: 'México' },
  { name: 'MercadoLibre', sector: 'E-Commerce', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Nubank', sector: 'Fintech', city: 'São Paulo', country: 'Brasil' },
  { name: 'Globant', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Bitso', sector: 'Fintech', city: 'Ciudad de México', country: 'México' },
  { name: 'Rappi', sector: 'Delivery', city: 'Bogotá', country: 'Colombia' },
  { name: 'Ualá', sector: 'Fintech', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Itaú', sector: 'Financiero', city: 'São Paulo', country: 'Brasil' },
  { name: 'Banco de Chile', sector: 'Financiero', city: 'Santiago', country: 'Chile' },
  { name: 'Falabella', sector: 'Retail', city: 'Santiago', country: 'Chile' },
  { name: 'Linio', sector: 'E-Commerce', city: 'Bogotá', country: 'Colombia' },
  { name: 'dLocal', sector: 'Fintech', city: 'Montevideo', country: 'Uruguay' },
  { name: 'Despegar', sector: 'Viajes', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Cornershop', sector: 'Delivery', city: 'Santiago', country: 'Chile' },
  { name: 'Kavak', sector: 'Automotriz', city: 'Ciudad de México', country: 'México' },
  { name: 'N5 Now', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Mercado Pago', sector: 'Fintech', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Clip', sector: 'Fintech', city: 'Ciudad de México', country: 'México' },
  { name: 'Platanus', sector: 'Fintech', city: 'Santiago', country: 'Chile' },
  { name: 'Tul', sector: 'Retail Tech', city: 'Ciudad de México', country: 'México' },
  { name: 'Genius Sports', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Tiendas Neto', sector: 'Retail', city: 'Bogotá', country: 'Colombia' },
  { name: 'Wenance', sector: 'Fintech', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Aleph', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Club CCM', sector: 'Financiero', city: 'Bogotá', country: 'Colombia' },
  { name: 'Banco Pichincha', sector: 'Financiero', city: 'Quito', country: 'Ecuador' },
  { name: 'Rappi Pay', sector: 'Fintech', city: 'Bogotá', country: 'Colombia' },
  { name: 'PideYa', sector: 'Delivery', city: 'Lima', country: 'Perú' },
  { name: 'Nowports', sector: 'Logística', city: 'Monterrey', country: 'México' },
  { name: 'Fintual', sector: 'Inversiones', city: 'Santiago', country: 'Chile' },
  { name: 'Buoyant', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Almundo', sector: 'Viajes', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Grability', sector: 'Tecnología', city: 'Bogotá', country: 'Colombia' },
  { name: 'AFIP', sector: 'Gobierno', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Banco Galicia', sector: 'Financiero', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Satellogic', sector: 'Aeroespacial', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'PedidosYa', sector: 'Delivery', city: 'Montevideo', country: 'Uruguay' },
  { name: 'Banco Bradesco', sector: 'Financiero', city: 'São Paulo', country: 'Brasil' },
  { name: 'VTEX', sector: 'E-Commerce', city: 'São Paulo', country: 'Brasil' },
  { name: 'Lofty', sector: 'PropTech', city: 'São Paulo', country: 'Brasil' },
  { name: 'Clarika', sector: 'Fintech', city: 'Santiago', country: 'Chile' },
  { name: 'Xepelin', sector: 'Fintech', city: 'Santiago', country: 'Chile' },
  { name: 'Auth0 (Okta)', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Mural', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Globant X', sector: 'Consultoría', city: 'Bogotá', country: 'Colombia' },
  { name: 'OXXO', sector: 'Retail', city: 'Monterrey', country: 'México' },
  { name: 'Cinepolis', sector: 'Entretenimiento', city: 'Morelia', country: 'México' },
  { name: 'Bodega Aurrera', sector: 'Retail', city: 'Ciudad de México', country: 'México' },
  { name: 'Grupo Bimbo', sector: 'Alimentos', city: 'Ciudad de México', country: 'México' },
  { name: 'FEMSA', sector: 'Bebidas', city: 'Monterrey', country: 'México' },
  { name: 'Televisa', sector: 'Medios', city: 'Ciudad de México', country: 'México' },
  { name: 'América Móvil', sector: 'Telecomunicaciones', city: 'Ciudad de México', country: 'México' },
  { name: 'CEMEX', sector: 'Construcción', city: 'Monterrey', country: 'México' },
  { name: 'Grupo Carso', sector: 'Conglomerado', city: 'Ciudad de México', country: 'México' },
  { name: 'Alsea', sector: 'Restaurantes', city: 'Ciudad de México', country: 'México' },
  { name: 'Ripio', sector: 'Crypto', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Lemon Cash', sector: 'Crypto', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Belcorp', sector: 'Cosméticos', city: 'Lima', country: 'Perú' },
  { name: 'Yape', sector: 'Fintech', city: 'Lima', country: 'Perú' },
  { name: 'RecargaPay', sector: 'Fintech', city: 'São Paulo', country: 'Brasil' },
  { name: 'Stone', sector: 'Fintech', city: 'São Paulo', country: 'Brasil' },
  { name: 'Meliuz', sector: 'E-Commerce', city: 'São Paulo', country: 'Brasil' },
  { name: 'MadeiraMadeira', sector: 'E-Commerce', city: 'Curitiba', country: 'Brasil' },
  { name: 'Loggi', sector: 'Logística', city: 'São Paulo', country: 'Brasil' },
  { name: 'iFood', sector: 'Delivery', city: 'São Paulo', country: 'Brasil' },
  { name: '99 Taxis', sector: 'Movilidad', city: 'São Paulo', country: 'Brasil' },
  { name: 'Colombia Fintech', sector: 'Fintech', city: 'Bogotá', country: 'Colombia' },
  { name: 'Huawei Latam', sector: 'Tecnología', city: 'Bogotá', country: 'Colombia' },
  { name: 'Grupo Aval', sector: 'Financiero', city: 'Bogotá', country: 'Colombia' },
  { name: 'Bancolombia', sector: 'Financiero', city: 'Medellín', country: 'Colombia' },
  { name: 'Rappi Servicios', sector: 'Delivery', city: 'Bogotá', country: 'Colombia' },
  { name: 'Davivienda', sector: 'Financiero', city: 'Bogotá', country: 'Colombia' },
  { name: 'LATAM Airlines', sector: 'Aerolínea', city: 'Santiago', country: 'Chile' },
  { name: 'Cencosud', sector: 'Retail', city: 'Santiago', country: 'Chile' },
  { name: 'Banco Estado', sector: 'Financiero', city: 'Santiago', country: 'Chile' },
  { name: 'MercadoLibre Brasil', sector: 'E-Commerce', city: 'São Paulo', country: 'Brasil' },
  { name: 'TOTVS', sector: 'Tecnología', city: 'São Paulo', country: 'Brasil' },
  { name: 'Wizeline', sector: 'Tecnología', city: 'Guadalajara', country: 'México' },
  { name: 'WeWork Latam', sector: 'Coworking', city: 'Ciudad de México', country: 'México' },
  { name: 'SoftServe Latam', sector: 'Tecnología', city: 'Ciudad de México', country: 'México' },
  { name: 'Endava Latam', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina' },
  { name: 'Gorilla Logic', sector: 'Tecnología', city: 'San José', country: 'Costa Rica' },
  { name: 'Banco Nacional CR', sector: 'Financiero', city: 'San José', country: 'Costa Rica' },
  { name: 'Banco Costa Rica', sector: 'Financiero', city: 'San José', country: 'Costa Rica' },
  { name: 'Copa Airlines', sector: 'Aerolínea', city: 'Panamá', country: 'Panamá' },
  { name: 'Banco General', sector: 'Financiero', city: 'Panamá', country: 'Panamá' },
  { name: 'Carvana Auto', sector: 'Automotriz', city: 'Guadalajara', country: 'México' },
  { name: 'Kueski', sector: 'Fintech', city: 'Ciudad de México', country: 'México' },
  { name: 'Stori', sector: 'Fintech', city: 'Ciudad de México', country: 'México' },
  { name: 'Jeeves', sector: 'Fintech', city: 'Ciudad de México', country: 'México' },
  { name: 'Albo', sector: 'Fintech', city: 'Ciudad de México', country: 'México' },
  { name: 'Banco Inter', sector: 'Fintech', city: 'São Paulo', country: 'Brasil' },
  { name: 'Nu Pagamentos', sector: 'Fintech', city: 'São Paulo', country: 'Brasil' },
  { name: 'C6 Bank', sector: 'Fintech', city: 'São Paulo', country: 'Brasil' },
  { name: 'PicPay', sector: 'Fintech', city: 'São Paulo', country: 'Brasil' },
  { name: 'Moov', sector: 'Tecnología', city: 'São Paulo', country: 'Brasil' },
  { name: 'Banco Safra', sector: 'Financiero', city: 'São Paulo', country: 'Brasil' },
  { name: 'Rede D\'Or', sector: 'Salud', city: 'São Paulo', country: 'Brasil' },
  { name: 'RD Saúde', sector: 'Salud', city: 'São Paulo', country: 'Brasil' },
];

const FN_M = ['Roberto','Felipe','Andrés','Sebastián','Gonzalo','Matías','Tomás','Nicolás','Diego','Santiago','Martín','Lucas','Pablo','Emilio','Ricardo','Hernán','Marcelo','Raúl','Fernando','Javier','Miguel','Óscar','Ramiro','Agustín','Cristian','Eduardo','Gustavo','Héctor','Iván','Joaquín','Leandro','Marcos','Patricio','Rodrigo','Vicente','Walter','Adrián','Bruno','Carlos','Daniel','Esteban','Fabián','Gabriel','Hugo','Ignacio','Jorge','Kevin','Luis'];
const FN_F = ['Carolina','Valentina','Daniela','Isabella','Camila','Sofía','María José','Luciana','Paula','Fernanda','Alejandra','Catalina','Elena','Gabriela','Jimena','Lorena','Natalia','Patricia','Renata','Silvia','Tatiana','Verónica','Ximena','Andrea','Beatriz','Claudia','Diana','Eva','Florence','Gloria','Helena','Inés','Juliana','Karina','Laura','Mónica','Nora','Olivia','Pilar','Rosa','Sara','Teresa','Úrsula','Vanesa','Wendy','Yolanda','Zoila','Mariana','Constanza'];
const LN = ['González','Rodríguez','López','Martínez','García','Hernández','Pérez','Sánchez','Ramírez','Torres','Flores','Rivera','Gómez','Díaz','Cortés','Vargas','Morales','Castro','Ortiz','Rojas','Medina','Chávez','Herrera','Aguilar','Jiménez','Ruiz','Domínguez','Romero','Reyes','Mendoza','Alvarez','Gutiérrez','Navarro','Molina','Campos','Ríos','Soto','Vega','Delgado','Aguirre'];
const POSITIONS = ['CEO','CTO','CFO','COO','VP de Ventas','Director Comercial','Head de Compras','Gerente General','Gerente de Tecnología','Director de Innovación','Head de Operaciones','VP de Finanzas','Director de Marketing','Gerente de Producto','Head de Partnerships','Director de Expansión','CIO','VP de Operaciones','Head de Estrategia','Director de Transformación Digital','Gerente Comercial','Head de Business Development','Director de Alianzas','VP de Growth','Gerente de Cuentas'];
const TAGS = ['enterprise','fintech','retail','tech','crypto','logistica','salud','gobierno','aeroespacial','food','construccion','telecom','media','automotriz','ecommerce','delivery','consultoria','coworking','inversiones','prop-tech','big-ticket','estrategico','expansion','renovacion','upsell','cross-sell','referral'];

const pick = a => a[Math.floor(Math.random()*a.length)];
const pickN = (a,n) => [...a].sort(()=>Math.random()-0.5).slice(0,n);
const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const genId = () => Math.random().toString(36).substring(2,11);

const now = new Date('2026-06-25T14:00:00Z');
const daysAgo = d => new Date(now.getTime()-d*864e5).toISOString();
const hoursAgo = h => new Date(now.getTime()-h*36e5).toISOString();
const daysFromNow = d => new Date(now.getTime()+d*864e5).toISOString();
const dateStr = d => d.toISOString().split('T')[0];

const US = [
  {id:'u1',name:'Alejandro Ruiz',email:'alejandro.ruiz@nexuscrm.com',avatar:'',role:'admin',department:'Dirección',phone:'+52 55 1234 5678',status:'online',createdAt:'2024-01-15T10:00:00Z'},
  {id:'u2',name:'María Fernanda López',email:'maria.lopez@nexuscrm.com',avatar:'',role:'supervisor',department:'Ventas',phone:'+52 55 2345 6789',status:'online',createdAt:'2024-02-01T09:00:00Z'},
  {id:'u3',name:'Carlos Andrés Mendoza',email:'carlos.mendoza@nexuscrm.com',avatar:'',role:'vendedor',department:'Ventas',phone:'+52 55 3456 7890',status:'online',createdAt:'2024-03-10T08:30:00Z'},
  {id:'u4',name:'Valentina Herrera',email:'valentina.herrera@nexuscrm.com',avatar:'',role:'vendedor',department:'Ventas',phone:'+52 55 4567 8901',status:'online',createdAt:'2024-03-15T11:00:00Z'},
  {id:'u5',name:'Diego Alejandro Torres',email:'diego.torres@nexuscrm.com',avatar:'',role:'vendedor',department:'Ventas',phone:'+52 55 5678 9012',status:'ausente',createdAt:'2024-04-01T09:00:00Z'},
  {id:'u6',name:'Sofía Camila Ramírez',email:'sofia.ramirez@nexuscrm.com',avatar:'',role:'supervisor',department:'Marketing',phone:'+52 55 6789 0123',status:'online',createdAt:'2024-02-15T10:00:00Z'},
  {id:'u7',name:'Mateo Sebastián García',email:'mateo.garcia@nexuscrm.com',avatar:'',role:'vendedor',department:'Ventas',phone:'+52 55 7890 1234',status:'online',createdAt:'2024-05-01T08:00:00Z'},
  {id:'u8',name:'Isabella Martínez',email:'isabella.martinez@nexuscrm.com',avatar:'',role:'invitado',department:'Soporte',phone:'+52 55 8901 2345',status:'offline',createdAt:'2024-06-01T09:30:00Z'},
];

// Seeded random for determinism in key areas
let seed = 42;
function seededRandom() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
const sPick = a => a[Math.floor(seededRandom()*a.length)];
const sRand = (a,b) => Math.floor(seededRandom()*(b-a+1))+a;

// ── 500 CLIENTS ──
const clients = [];
for (let i = 0; i < 500; i++) {
  const isMale = Math.random() > 0.45;
  const firstName = isMale ? pick(FN_M) : pick(FN_F);
  const lastName = pick(LN);
  let company, sector, city, country;
  if (i < COMPANIES.length) {
    company = COMPANIES[i].name; sector = COMPANIES[i].sector; city = COMPANIES[i].city; country = COMPANIES[i].country;
  } else {
    const prefixes = ['Tech','Digital','Global','Alpha','Nova','Prime','Sigma','Atlas','Vertex','Zenith','Quantum','Apex','Pulse','Core','Link','Flow','Data','Cloud','Smart','Nexa'];
    const suffixes = ['Solutions','Tech','Labs','Group','Systems','Corp','Holdings','Digital','Latam','Partners','Network','Services','Dynamics','Ventures','Innovation'];
    const suffix = ['MX','AR','BR','CO','CL','PE'][rand(0,5)];
    company = `${pick(prefixes)} ${pick(suffixes)} ${suffix}`;
    sector = pick(['Tecnología','Consultoría','Servicios','Industria','Comercio','Financiero','Salud','Energía']);
    const locs = [{c:'Ciudad de México',co:'México'},{c:'Guadalajara',co:'México'},{c:'Monterrey',co:'México'},{c:'Buenos Aires',co:'Argentina'},{c:'Córdoba',co:'Argentina'},{c:'São Paulo',co:'Brasil'},{c:'Río de Janeiro',co:'Brasil'},{c:'Bogotá',co:'Colombia'},{c:'Medellín',co:'Colombia'},{c:'Santiago',co:'Chile'},{c:'Lima',co:'Perú'},{c:'Quito',co:'Ecuador'},{c:'Montevideo',co:'Uruguay'},{c:'Panamá',co:'Panamá'},{c:'San José',co:'Costa Rica'}];
    const loc = pick(locs); city = loc.c; country = loc.co;
  }
  const status = i < 50 ? 'perdido' : i < 120 ? 'potencial' : i < 380 ? 'activo' : Math.random()>0.5?'activo':'inactivo';
  const assignedTo = pick(US);
  const value = status==='perdido'?rand(0,50000):status==='potencial'?rand(5000,80000):rand(20000,500000);
  const cd = rand(10,540);
  const ld = status==='activo'?rand(0,14):status==='inactivo'?rand(15,90):rand(1,180);
  const clean = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  clients.push({
    id:`c${i+1}`, firstName, lastName,
    email:`${clean(firstName)}.${clean(lastName)}@${clean(company)}.com`,
    phone:`+${rand(1,5)}${rand(10,99)} ${rand(100,9999)} ${rand(1000,9999)}`,
    company, position:pick(POSITIONS),
    address:`Av. ${pick(['Reforma','Insurgentes','Corrientes','Paulista','El Dorado','Providencia','9 de Julio','Santa Fe'])} ${rand(100,9999)}`,
    city, country, status, source:pick(['web','referido','linkedin','evento','cold_call','otro']),
    tags:pickN(TAGS,rand(1,4)), value, notes:'', assignedTo:assignedTo.id,
    createdAt:daysAgo(cd), updatedAt:daysAgo(Math.min(cd,ld+rand(0,5))), lastActivity:daysAgo(ld),
  });
}

// ── 100 OPPORTUNITIES ──
const STAGES = ['lead','contactado','calificado','reunion','propuesta','negociacion','ganado','perdido'];
const stageW = [15,18,15,12,14,10,10,6];
const wStages = []; stageW.forEach((w,i)=>{for(let j=0;j<w;j++)wStages.push(STAGES[i]);});
const activeC = clients.filter(c=>c.status==='activo'||c.status==='potencial');
const titles = ['Licencia Enterprise CRM','Plataforma de Automatización','Servicios de Consultoría Digital','Migración Cloud','Suite de Análisis de Datos','Integración API','Desarrollo a Medida','Renovación Anual','Expansión Regional','Programa de Partnerships','Onboarding Enterprise','Soporte Premium','Capacitación Equipo','Auditoría de Seguridad','Implementación ERP','Dashboard Ejecutivo','Portal de Clientes','Sistema de Gestión Comercial','Chatbot Inteligente','Plataforma de Pagos','Gestión de Inventario','Sistema de Logística','Plataforma E-Learning','App Móvil Empresarial','Data Warehouse','BI y Reporting','Gestión de Proyectos','CRM Avanzado'];
const probMap = {lead:10,contactado:25,calificado:40,reunion:55,propuesta:65,negociacion:80,ganado:100,perdido:0};
const opportunities = [];
for (let i=0;i<100;i++){
  const cl = activeC[i%activeC.length];
  const stage = pick(wStages);
  const bv = rand(15000,250000);
  const at = pick(US);
  opportunities.push({
    id:`o${i+1}`, title:pick(titles), clientId:cl.id, clientName:cl.company,
    value: stage==='ganado'?bv:bv*(1+Math.random()*0.5), stage,
    probability:Math.min(100,Math.max(0,(probMap[stage]||50)+rand(-5,5))),
    assignedTo:at.id, assignedName:at.name,
    expectedCloseDate:daysFromNow(stage==='ganado'?-rand(5,60):rand(3,90)),
    createdAt:daysAgo(rand(10,180)), updatedAt:daysAgo(rand(0,7)),
    description:`Oportunidad comercial con ${cl.company} para ${pick(titles).toLowerCase()}.`,
  });
}

// ── 1000 ACTIVITIES ──
const ACT_TYPES = ['llamada','email','reunion','nota','cambio_estado','tarea','comentario'];
const verbs = {
  llamada:['Realizó llamada de seguimiento con','Llamó para confirmar reunión con','Discutió propuesta comercial con','Siguió up de propuesta con','Contactó por teléfono a'],
  email:['Envío propuesta comercial a','Envió follow-up por email a','Compartió presentación ejecutiva con','Respondió consulta de','Envío cotización actualizada a'],
  reunion:['Reunión de presentación con','Demo del producto a','Sesión de workshop con','Negociación de términos con','Review de progreso con'],
  cambio_estado:['Movió oportunidad a Negociación:','Avanzó etapa a Propuesta:','Actualizó pipeline de','Cerró oportunidad con','Marcó como calificado a'],
  tarea:['Completó tarea de seguimiento para','Programó llamada para','Agendó demo para','Actualizó CRM de','Preparó propuesta para'],
  nota:['Registró nota de reunión con','Documentó requerimientos de','Actualizó información de','Agregó comentarios sobre','Archivó comunicación con'],
  comentario:['Comentó sobre avance de','Dejó observación en oportunidad de','Actualizó notas internas de','Registró feedback de','Añadió contexto a'],
};
const activities = [];
for (let i=0;i<1000;i++){
  const type = pick(ACT_TYPES);
  const cl = pick(clients);
  const user = pick(US.filter(u=>u.role!=='invitado'));
  const verb = pick(verbs[type]);
  const hBack = rand(1,720);
  const desc_map = {
    llamada:`Duración: ${rand(5,45)} min. Se discutieron próximos pasos y se agendó seguimiento.`,
    email:`Asunto: ${pick(['Seguimiento propuesta','Actualización proyecto','Reunión agendada','Cotización','Información adicional'])}. CC: ${pick(US.filter(u=>u.id!==user.id)).name}.`,
    reunion:`Duración: ${rand(30,90)} min. Participantes: ${pickN(US.filter(u=>u.role!=='invitado'),rand(1,3)).map(u=>u.name).join(', ')}. Se definieron acciones concretas.`,
    cambio_estado:`Oportunidad movida. Motivo: ${pick(['Interés confirmado','Presupuesto aprobado','Reunión exitosa','Firma pendiente'])}.`,
    tarea:`Tarea completada para seguimiento del equipo comercial.`,
    nota:`Detalle de la actividad registrada para seguimiento del equipo comercial.`,
    comentario:`Comentario interno registrado para referencia del equipo.`,
  };
  activities.push({
    id:`a${i+1}`, type, title:`${verb} ${cl.company}`, description:desc_map[type],
    clientId:cl.id, clientName:cl.company, userId:user.id, userName:user.name,
    createdAt:hoursAgo(hBack),
  });
}
activities.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());

// ── 50 TASKS ──
const taskTitles = ['Llamar a {company} para seguimiento','Enviar cotización a {company}','Preparar demo para {company}','Agendar reunión con {company}','Revisar contrato pendiente de {company}','Actualizar CRM con datos de {company}','Enviar NDA a {company}','Coordinar llamada técnica con {company}','Preparar propuesta de valor para {company}','Seguimiento de pago de {company}','Confirmar requisitos de integración con {company}','Programar workshop onboard con {company}','Revisar SLA de {company}','Enviar caso de éxito a {company}','Preparar ROI para {company}','Negociar renovación con {company}','Solicitar referencias de {company}','Coordinar entrega con {company}','Verificar firma de contrato de {company}','Preparar informe mensual para {company}'];
const tasks = [];
for (let i=0;i<50;i++){
  const cl = pick(clients);
  const at = pick(US.filter(u=>u.role!=='invitado'));
  const status = i<20?'pendiente':i<30?'en_progreso':i<45?'completada':'cancelada';
  const priority = i<5?'urgente':i<15?'alta':i<35?'media':'baja';
  tasks.push({
    id:`t${i+1}`, title:pick(taskTitles).replace('{company}',cl.company),
    description:`Tarea asignada para gestión comercial con ${cl.company}.`,
    assignedTo:at.id, assignedName:at.name, clientId:cl.id, clientName:cl.company,
    priority, status, dueDate:dateStr(new Date(now.getTime()+(status==='completada'?-rand(1,10):rand(0,14))*864e5)),
    createdAt:daysAgo(rand(1,30)), tags:pickN(['seguimiento','propuesta','contrato','demo','renovacion','onboard','soporte'],rand(0,3)),
  });
}

// ── 25 CALENDAR EVENTS ──
const calColors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#3b82f6','#f97316','#06b6d4'];
const calendarEvents = [];
for (let i=0;i<25;i++){
  const cl = pick(clients.filter(c=>c.status==='activo'));
  const at = pick(US.filter(u=>u.role!=='invitado'));
  const type = pick(['reunion','seguimiento','llamada','evento']);
  const isUp = i<20;
  const dOff = isUp?rand(0,14):-rand(1,7);
  const ed = new Date(now.getTime()+dOff*864e5);
  const sh = rand(8,17);
  const dur = type==='reunion'?rand(1,2):type==='llamada'?1:rand(1,3);
  const tMap = {
    reunion:[`Demo producto — ${cl.company}`,`Review quarterly — ${cl.company}`,`Negociación contrato — ${cl.company}`,`Onboard — ${cl.company}`],
    seguimiento:[`Follow-up ${cl.company}`,`Revisión pipeline ${cl.company}`,`Check-in semanal ${cl.company}`],
    llamada:[`Llamada con ${cl.company}`,`Seguimiento telefónico ${cl.company}`],
    evento:[`Webinar: Transformación Digital`,`Q3 Sales Kickoff`,`Review mensual equipo`,`Capacitación producto`],
  };
  calendarEvents.push({
    id:`ev${i+1}`, title:pick(tMap[type]),
    description:type==='reunion'?`Reunión con ${cl.firstName} ${cl.lastName} de ${cl.company}`:`Seguimiento con ${cl.company}`,
    type, date:dateStr(ed), startTime:`${String(sh).padStart(2,'0')}:00`, endTime:`${String(sh+dur).padStart(2,'0')}:00`,
    clientId:cl.id, clientName:cl.company, assignedTo:at.id, assignedName:at.name, color:pick(calColors),
  });
}

// ── NOTES ──
const noteTemplates = [
  {t:'Notas de reunión — {c}',c:'Se discutieron los requerimientos principales. El equipo técnico necesita acceso a APIs. Se acordó enviar propuesta antes del viernes.\n\nPuntos clave:\n- Integración con ERP existente\n- Migración de datos históricos\n- Capacitación a 15 personas\n- Timeline: 8 semanas'},
  {t:'Estrategia de acercamiento — {c}',c:'Plan de 30 días:\n1. Semana 1: Demo personalizada\n2. Semana 2: Reunión con decisor\n3. Semana 3: Propuesta económica\n4. Semana 4: Negociación final'},
  {t:'Historial de trato — {c}',c:'Primer contacto en Latam Tech Summit 2025. Se mantuvo comunicación por LinkedIn. En marzo se reactivó el interés. Relación: cálida, responden en 24h.'},
  {t:'Requerimientos técnicos — {c}',c:'Stack actual: SAP S/4HANA, Salesforce, Google Workspace.\n\nNecesidades:\n- Migración parcial de Salesforce\n- Integración con SAP vía REST\n- SSO con Okta\n- Data residency (LGPD)'},
  {t:'Competencia — {c}',c:'También evalúan Salesforce y HubSpot. Nuestros diferenciadores:\n- Mejor localización Latam\n- Soporte en español\n- Pricing competitivo enterprise\n- Implementación más rápida'},
  {t:'Oportunidad cross-sell — {c}',c:'Interés adicional en:\n- Marketing automation\n- Analytics avanzado\n- Portal de partners\n\nValor total estimado: 2.3x el deal inicial.'},
];
const notes = [];
for (let i=0;i<15;i++){
  const cl = pick(clients);
  const tpl = pick(noteTemplates);
  const by = pick(US);
  notes.push({
    id:`n${i+1}`, title:tpl.t.replace('{c}',cl.company), content:tpl.c.replace(/{c}/g,cl.company),
    clientId:cl.id, clientName:cl.company, createdBy:by.id, createdByName:by.name,
    createdAt:daysAgo(rand(1,60)), updatedAt:daysAgo(rand(0,5)),
    tags:pickN(['estrategia','tecnico','competencia','seguimiento','cierre'],rand(1,3)), isPinned:i<3,
  });
}

// ── NOTIFICATIONS ──
const notifications = [
  {id:'not1',type:'warning',title:'Propuesta vence mañana',message:`La propuesta para ${clients[0].company} vence el 26 de junio.`,read:false,createdAt:hoursAgo(2)},
  {id:'not2',type:'success',title:'Contrato firmado',message:`${clients[1].company} firmó contrato enterprise por $180,000.`,read:false,createdAt:hoursAgo(4)},
  {id:'not3',type:'info',title:'Nueva reunión programada',message:`Demo con ${clients[2].company} confirmada para mañana 10:00.`,read:false,createdAt:hoursAgo(6)},
  {id:'not4',type:'error',title:'Tarea vencida',message:`Seguimiento de ${clients[3].company} está 2 días vencida.`,read:false,createdAt:hoursAgo(8)},
  {id:'not5',type:'warning',title:'Cliente sin actividad',message:`${clients[4].company} lleva 14 días sin contacto.`,read:false,createdAt:hoursAgo(12)},
  {id:'not6',type:'success',title:'Oportunidad avanzada',message:`Carlos Mendoza movió ${clients[5].company} a Negociación.`,read:true,createdAt:daysAgo(1)},
  {id:'not7',type:'info',title:'Objetivo mensual',message:'Equipo al 80% de la meta. Faltan $135,000. Quedan 5 días.',read:true,createdAt:daysAgo(1)},
  {id:'not8',type:'warning',title:'Pipeline en riesgo',message:'3 oportunidades por $200K+ sin actividad en 7 días.',read:true,createdAt:daysAgo(2)},
];

const automations = [
  {id:'au1',name:'Seguimiento automático de leads',description:'Cuando un lead no tiene actividad en 48h, crea tarea de seguimiento.',trigger:'client_inactive',action:'create_task',isActive:true,createdAt:daysAgo(90),runCount:147},
  {id:'au2',name:'Notificación de cambio de etapa',description:'Notifica al supervisor cuando oportunidad >$50K cambia de etapa.',trigger:'stage_change',action:'send_notification',isActive:true,createdAt:daysAgo(75),runCount:89},
  {id:'au3',name:'Asignación automática por región',description:'Asigna nuevos leads al vendedor de la región correspondiente.',trigger:'new_lead',action:'assign_user',isActive:true,createdAt:daysAgo(60),runCount:234},
  {id:'au4',name:'Escalamiento de inactivos',description:'Cliente activo sin actividad 14 días → notifica supervisor + crea tarea.',trigger:'client_inactive',action:'send_notification',isActive:true,createdAt:daysAgo(45),runCount:56},
  {id:'au5',name:'Avance automático de etapa',description:'Tarea "enviar propuesta" completada → mueve a etapa Propuesta.',trigger:'task_completed',action:'change_stage',isActive:false,createdAt:daysAgo(30),runCount:12},
  {id:'au6',name:'Bienvenida a leads de alto valor',description:'Notifica al equipo cuando se registra lead con valor >$30K.',trigger:'new_lead',action:'send_notification',isActive:true,createdAt:daysAgo(20),runCount:78},
];

const topOpps = [...opportunities.filter(o=>!['ganado','perdido'].includes(o.stage))].sort((a,b)=>b.value-a.value).slice(0,5);
const aiInsights = [
  {id:'ai1',type:'alert',title:`${topOpps[0]?.clientName||'Banco Santander'} — Riesgo de abandono`,description:`Este cliente lleva 12 días sin actividad. La probabilidad de cierre bajó de 85% a 72%. Se recomienda programar llamada esta semana.`,confidence:87,clientId:topOpps[0]?.clientId,clientName:topOpps[0]?.clientName,createdAt:hoursAgo(3)},
  {id:'ai2',type:'suggestion',title:`${topOpps[1]?.clientName||'MercadoLibre'} — Alta probabilidad de cierre`,description:`El contacto abrió dos correos de propuesta y respondió al follow-up en menos de 2h. Acción recomendada: enviar propuesta formal con descuento por cierre anticipado.`,confidence:82,clientId:topOpps[1]?.clientId,clientName:topOpps[1]?.clientName,createdAt:hoursAgo(5)},
  {id:'ai3',type:'prediction',title:'Pipeline Q3 — Proyección de $2.1M',description:'Basado en velocidad de cierre ($285K/semana) y pipeline activo ($3.2M), se proyecta cierre Q3 en $2.1M. 18% sobre meta trimestral.',confidence:74,createdAt:hoursAgo(8)},
  {id:'ai4',type:'alert',title:`${topOpps[2]?.clientName||'Nubank'} — Propuesta sin respuesta`,description:'La propuesta enviada hace 5 días no fue abierta. Patrón similar a 3 oportunidades perdidas en Q1. Recomendación: llamar al decision maker.',confidence:71,clientId:topOpps[2]?.clientId,clientName:topOpps[2]?.clientName,createdAt:hoursAgo(12)},
  {id:'ai5',type:'suggestion',title:`Cross-sell con ${topOpps[3]?.clientName||'Globant'}`,description:'Solo usan módulo de ventas. Adopción del 92% DAU. Clientes similares que agregan marketing incrementan LTV 45%.',confidence:68,clientId:topOpps[3]?.clientId,clientName:topOpps[3]?.clientName,createdAt:daysAgo(1)},
  {id:'ai6',type:'prediction',title:'Mejor momento para contactar leads',description:'Martes y jueves 10:00-11:30 tienen 2.3x más tasa de respuesta. Horario almuerzo: solo 8%.',confidence:91,createdAt:daysAgo(1)},
  {id:'ai7',type:'suggestion',title:`Renovación en riesgo — ${clients[10]?.company||'Rappi'}`,description:'Contrato vence en 23 días sin negociación de renovación. Uso bajó 15% en 2 semanas. Históricamente 78% precisión como indicador de churn.',confidence:78,clientId:clients[10]?.id,clientName:clients[10]?.company,createdAt:daysAgo(2)},
  {id:'ai8',type:'alert',title:'Objetivo mensual en riesgo',description:'Con 5 días hábiles restantes, se necesitan $135,000 adicionales. Hay 4 oportunidades en Negociación por $380,000.',confidence:65,createdAt:hoursAgo(1)},
];

// ── CHART DATA ──
const wonOpps = opportunities.filter(o=>o.stage==='ganado');
const totalRev = wonOpps.reduce((s,o)=>s+o.value,0);
const activePipe = opportunities.filter(o=>!['ganado','perdido'].includes(o.stage)).reduce((s,o)=>s+o.value,0);
const fmtCompact = n => n>=1e6?`$${(n/1e6).toFixed(1)}M`:n>=1e3?`$${(n/1e3).toFixed(0)}K`:`$${n}`;

const kpiData = [
  {label:'Ingresos del Mes',value:'$565,000',change:12.4,changeLabel:'vs. mes anterior',icon:'dollar-sign'},
  {label:'Nuevos Clientes',value:'23',change:8.2,changeLabel:'vs. mes anterior',icon:'users'},
  {label:'Deals Cerrados',value:'7',change:15.0,changeLabel:'vs. mes anterior',icon:'target'},
  {label:'Pipeline Activo',value:fmtCompact(activePipe),change:-3.2,changeLabel:'vs. semana pasada',icon:'bar-chart'},
  {label:'Tasa de Cierre',value:'34.2%',change:5.1,changeLabel:'vs. mes anterior',icon:'trending-up'},
  {label:'Actividades Hoy',value:'47',change:22.0,changeLabel:'vs. ayer',icon:'activity'},
];

const months = ['Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May','Jun'];
const monthlySalesData = months.map(name=>({name,value:rand(280000,520000),value2:rand(220000,440000)}));

const stageLabels = ['Lead','Contactado','Calificado','Reunión','Propuesta','Negociación','Ganado','Perdido'];
const pipelineData = STAGES.map((stage,i)=>{
  const ops = opportunities.filter(o=>o.stage===stage);
  return {stage:stageLabels[i],value:ops.reduce((s,o)=>s+o.value,0),count:ops.length};
});

const sellers = US.filter(u=>u.role==='vendedor'||u.role==='supervisor');
const teamPerformanceData = sellers.map(u=>{
  const uO = opportunities.filter(o=>o.assignedTo===u.id);
  return {name:u.name.split(' ')[0],revenue:uO.filter(o=>o.stage==='ganado').reduce((s,o)=>s+o.value,0)||rand(80000,200000),deals:uO.filter(o=>o.stage==='ganado').length||rand(2,8),activities:rand(40,120)};
});

// ── OUTPUT ──
const out = `import type { User, Client, Opportunity, Task, Activity, Note, CalendarEvent, Notification, Automation, AIInsight, ChartDataPoint, KPIData } from '@/types';

export const users: User[] = ${JSON.stringify(US,null,2)} as User[];

export const clients: Client[] = ${JSON.stringify(clients,null,2)} as Client[];

export const opportunities: Opportunity[] = ${JSON.stringify(opportunities,null,2)} as Opportunity[];

export const activities: Activity[] = ${JSON.stringify(activities,null,2)} as Activity[];

export const tasks: Task[] = ${JSON.stringify(tasks,null,2)} as Task[];

export const calendarEvents: CalendarEvent[] = ${JSON.stringify(calendarEvents,null,2)} as CalendarEvent[];

export const notes: Note[] = ${JSON.stringify(notes,null,2)} as Note[];

export const notifications: Notification[] = ${JSON.stringify(notifications,null,2)} as Notification[];

export const automations: Automation[] = ${JSON.stringify(automations,null,2)} as Automation[];

export const aiInsights: AIInsight[] = ${JSON.stringify(aiInsights,null,2)} as AIInsight[];

export const kpiData: KPIData[] = ${JSON.stringify(kpiData,null,2)} as KPIData[];

export const monthlySalesData: ChartDataPoint[] = ${JSON.stringify(monthlySalesData,null,2)} as ChartDataPoint[];

export const pipelineData: { stage: string; value: number; count: number }[] = ${JSON.stringify(pipelineData,null,2)};

export const teamPerformanceData: { name: string; revenue: number; deals: number; activities: number }[] = ${JSON.stringify(teamPerformanceData,null,2)};
`;

const outPath = path.join(__dirname, '..', 'src', 'data', 'mockData.ts');
fs.writeFileSync(outPath, out, 'utf-8');
console.log(`Generado: ${outPath}`);
console.log(`  ${clients.length} clientes, ${opportunities.length} oportunidades, ${activities.length} actividades, ${tasks.length} tareas, ${calendarEvents.length} eventos`);