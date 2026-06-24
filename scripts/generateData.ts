// Script para generar dataset profesional masivo
// Se ejecuta manualmente con: npx tsx scripts/generateData.ts
// Output: se copia a src/data/mockData.ts

import type { User, Client, Opportunity, Task, Activity, Note, CalendarEvent, Notification, Automation, AIInsight, ChartDataPoint, KPIData } from '../src/types';

// ── Empresas Latam reales ──
const COMPANIES = [
  { name: 'Banco Santander', sector: 'Financiero', city: 'Ciudad de México', country: 'México', website: 'santander.com.mx' },
  { name: 'MercadoLibre', sector: 'E-Commerce', city: 'Buenos Aires', country: 'Argentina', website: 'mercadolibre.com' },
  { name: 'Nubank', sector: 'Fintech', city: 'São Paulo', country: 'Brasil', website: 'nubank.com.br' },
  { name: 'Globant', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'globant.com' },
  { name: 'Bitso', sector: 'Fintech', city: 'Ciudad de México', country: 'México', website: 'bitso.com' },
  { name: 'Rappi', sector: 'Delivery', city: 'Bogotá', country: 'Colombia', website: 'rappi.com' },
  { name: 'Ualá', sector: 'Fintech', city: 'Buenos Aires', country: 'Argentina', website: 'uala.com.ar' },
  { name: 'Itaú', sector: 'Financiero', city: 'São Paulo', country: 'Brasil', website: 'itau.com.br' },
  { name: 'Banco de Chile', sector: 'Financiero', city: 'Santiago', country: 'Chile', website: 'bancochile.cl' },
  { name: 'Falabella', sector: 'Retail', city: 'Santiago', country: 'Chile', website: 'falabella.com' },
  { name: 'Linio', sector: 'E-Commerce', city: 'Bogotá', country: 'Colombia', website: 'linio.com.co' },
  { name: 'dLocal', sector: 'Fintech', city: 'Montevideo', country: 'Uruguay', website: 'dlocal.com' },
  { name: 'Despegar', sector: 'Viajes', city: 'Buenos Aires', country: 'Argentina', website: 'despegar.com' },
  { name: 'Cornershop', sector: 'Delivery', city: 'Santiago', country: 'Chile', website: 'cornershopapp.com' },
  { name: 'Kavak', sector: 'Automotriz', city: 'Ciudad de México', country: 'México', website: 'kavak.com' },
  { name: 'N5 Now', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'n5now.com' },
  { name: 'Mercado Pago', sector: 'Fintech', city: 'Buenos Aires', country: 'Argentina', website: 'mercadopago.com' },
  { name: 'Clip', sector: 'Fintech', city: 'Ciudad de México', country: 'México', website: 'clip.mx' },
  { name: 'Platanus', sector: 'Fintech', city: 'Santiago', country: 'Chile', website: 'platanus.vc' },
  { name: 'Tul', sector: 'Retail Tech', city: 'Ciudad de México', country: 'México', website: 'tul.com' },
  { name: 'Genius Sports', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'geniussports.com' },
  { name: 'Tiendas Neto', sector: 'Retail', city: 'Bogotá', country: 'Colombia', website: 'tiendasneto.com' },
  { name: 'Wenance', sector: 'Fintech', city: 'Buenos Aires', country: 'Argentina', website: 'wenance.com' },
  { name: 'Aleph', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'aleph.com' },
  { name: 'Club CCM', sector: 'Financiero', city: 'Bogotá', country: 'Colombia', website: 'clubccm.com' },
  { name: 'Banco Pichincha', sector: 'Financiero', city: 'Quito', country: 'Ecuador', website: 'pichincha.com' },
  { name: 'Rappi Pay', sector: 'Fintech', city: 'Bogotá', country: 'Colombia', website: 'rappipay.com' },
  { name: 'PideYa', sector: 'Delivery', city: 'Lima', country: 'Perú', website: 'pideya.com' },
  { name: 'Nowports', sector: 'Logística', city: 'Monterrey', country: 'México', website: 'nowports.com' },
  { name: 'Fintual', sector: 'Inversiones', city: 'Santiago', country: 'Chile', website: 'fintual.com' },
  { name: 'Buoyant', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'buoyant.io' },
  { name: 'Almundo', sector: 'Viajes', city: 'Buenos Aires', country: 'Argentina', website: 'almundo.com' },
  { name: 'Grability', sector: 'Tecnología', city: 'Bogotá', country: 'Colombia', website: 'grability.com' },
  { name: 'AFIP', sector: 'Gobierno', city: 'Buenos Aires', country: 'Argentina', website: 'afip.gob.ar' },
  { name: 'Banco Galicia', sector: 'Financiero', city: 'Buenos Aires', country: 'Argentina', website: 'bancogalicia.com' },
  { name: 'Satellogic', sector: 'Aeroespacial', city: 'Buenos Aires', country: 'Argentina', website: 'satellogic.com' },
  { name: 'PedidosYa', sector: 'Delivery', city: 'Montevideo', country: 'Uruguay', website: 'pedidosya.com.uy' },
  { name: 'Banco Bradesco', sector: 'Financiero', city: 'São Paulo', country: 'Brasil', website: 'bradesco.com.br' },
  { name: 'VTEX', sector: 'E-Commerce', city: 'São Paulo', country: 'Brasil', website: 'vtex.com' },
  { name: 'Lofty', sector: 'PropTech', city: 'São Paulo', country: 'Brasil', website: 'lofty.com.br' },
  { name: 'Clarika', sector: 'Fintech', city: 'Santiago', country: 'Chile', website: 'clarika.cl' },
  { name: 'Xepelin', sector: 'Fintech', city: 'Santiago', country: 'Chile', website: 'xepelin.com' },
  { name: 'Auth0 (Okta)', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'auth0.com' },
  { name: 'Mural', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'mural.co' },
  { name: 'Globant X', sector: 'Consultoría', city: 'Bogotá', country: 'Colombia', website: 'globant.com' },
  { name: 'OXXO', sector: 'Retail', city: 'Monterrey', country: 'México', website: 'oxxo.com' },
  { name: 'Cinepolis', sector: 'Entretenimiento', city: 'Morelia', country: 'México', website: 'cinepolis.com' },
  { name: 'Bodega Aurrera', sector: 'Retail', city: 'Ciudad de México', country: 'México', website: 'bodegaaurrera.com.mx' },
  { name: 'Grupo Bimbo', sector: 'Alimentos', city: 'Ciudad de México', country: 'México', website: 'grupobimbo.com' },
  { name: 'FEMSA', sector: 'Bebidas', city: 'Monterrey', country: 'México', website: 'femsa.com' },
  { name: 'Televisa', sector: 'Medios', city: 'Ciudad de México', country: 'México', website: 'televisa.com' },
  { name: 'América Móvil', sector: 'Telecomunicaciones', city: 'Ciudad de México', country: 'México', website: 'americamovil.com' },
  { name: 'CEMEX', sector: 'Construcción', city: 'Monterrey', country: 'México', website: 'cemex.com' },
  { name: 'Grupo Carso', sector: 'Conglomerado', city: 'Ciudad de México', country: 'México', website: 'grupocarso.com' },
  { name: 'Alsea', sector: 'Restaurantes', city: 'Ciudad de México', country: 'México', website: 'alsea.com.mx' },
  { name: 'Ripio', sector: 'Crypto', city: 'Buenos Aires', country: 'Argentina', website: 'ripio.com' },
  { name: 'Lemon Cash', sector: 'Crypto', city: 'Buenos Aires', country: 'Argentina', website: 'lemon.cash' },
  { name: 'Belcorp', sector: 'Cosméticos', city: 'Lima', country: 'Perú', website: 'belcorp.com' },
  { name: 'Yape', sector: 'Fintech', city: 'Lima', country: 'Perú', website: 'yape.com.pe' },
  { name: 'RecargaPay', sector: 'Fintech', city: 'São Paulo', country: 'Brasil', website: 'recargapay.com.br' },
  { name: 'Stone', sector: 'Fintech', city: 'São Paulo', country: 'Brasil', website: 'stone.co' },
  { name: 'Meliuz', sector: 'E-Commerce', city: 'São Paulo', country: 'Brasil', website: 'meliuz.com.br' },
  { name: 'MadeiraMadeira', sector: 'E-Commerce', city: 'Curitiba', country: 'Brasil', website: 'madeiramadeira.com.br' },
  { name: 'Loggi', sector: 'Logística', city: 'São Paulo', country: 'Brasil', website: 'loggi.com' },
  { name: 'iFood', sector: 'Delivery', city: 'São Paulo', country: 'Brasil', website: 'ifood.com.br' },
  { name: '99 Taxis', sector: 'Movilidad', city: 'São Paulo', country: 'Brasil', website: '99taxis.com' },
  { name: 'Colombia Fintech', sector: 'Fintech', city: 'Bogotá', country: 'Colombia', website: 'colombiafintech.co' },
  { name: 'Huawei Latam', sector: 'Tecnología', city: 'Bogotá', country: 'Colombia', website: 'huawei.com' },
  { name: 'Grupo Aval', sector: 'Financiero', city: 'Bogotá', country: 'Colombia', website: 'grupoaval.com.co' },
  { name: 'Bancolombia', sector: 'Financiero', city: 'Medellín', country: 'Colombia', website: 'bancolombia.com' },
  { name: 'Rappi Servicios', sector: 'Delivery', city: 'Bogotá', country: 'Colombia', website: 'rappi.com' },
  { name: 'Davivienda', sector: 'Financiero', city: 'Bogotá', country: 'Colombia', website: 'davivienda.com' },
  { name: 'LATAM Airlines', sector: 'Aerolínea', city: 'Santiago', country: 'Chile', website: 'latam.com' },
  { name: 'Cencosud', sector: 'Retail', city: 'Santiago', country: 'Chile', website: 'cencosud.com' },
  { name: 'Banco Estado', sector: 'Financiero', city: 'Santiago', country: 'Chile', website: 'bancoestado.cl' },
  { name: 'MercadoLibre Brasil', sector: 'E-Commerce', city: 'São Paulo', country: 'Brasil', website: 'mercadolivre.com.br' },
  { name: 'TOTVS', sector: 'Tecnología', city: 'São Paulo', country: 'Brasil', website: 'totvs.com' },
  { name: 'Wizeline', sector: 'Tecnología', city: 'Guadalajara', country: 'México', website: 'wizeline.com' },
  { name: 'WeWork Latam', sector: 'Coworking', city: 'Ciudad de México', country: 'México', website: 'wework.com' },
  { name: 'SoftServe Latam', sector: 'Tecnología', city: 'Odesa', country: 'Ucrania', website: 'softserveinc.com' },
  { name: 'Endava Latam', sector: 'Tecnología', city: 'Buenos Aires', country: 'Argentina', website: 'endava.com' },
  { name: 'Gorilla Logic', sector: 'Tecnología', city: 'San José', country: 'Costa Rica', website: 'gorillalogic.com' },
  { name: 'Banco Nacional CR', sector: 'Financiero', city: 'San José', country: 'Costa Rica', website: 'bncr.fi.cr' },
  { name: 'Banco Costa Rica', sector: 'Financiero', city: 'San José', country: 'Costa Rica', website: 'bancocr.com' },
  { name: 'Copa Airlines', sector: 'Aerolínea', city: 'Panamá', country: 'Panamá', website: 'copaair.com' },
  { name: 'Banco General', sector: 'Financiero', city: 'Panamá', country: 'Panamá', website: 'bangeneral.com' },
  { name: 'Carvana Auto', sector: 'Automotriz', city: 'Guadalajara', country: 'México', website: 'carvana.mx' },
  { name: 'Kueski', sector: 'Fintech', city: 'Ciudad de México', country: 'México', website: 'kueski.com' },
  { name: 'Stori', sector: 'Fintech', city: 'Ciudad de México', country: 'México', website: 'stori.com' },
  { name: 'Jeeves', sector: 'Fintech', city: 'Ciudad de México', country: 'México', website: 'jeeves.com' },
  { name: 'Albo', sector: 'Fintech', city: 'Ciudad de México', country: 'México', website: 'albo.mx' },
  { name: 'Banco Inter', sector: 'Fintech', city: 'São Paulo', country: 'Brasil', website: 'inter.co' },
  { name: 'Nu Pagamentos', sector: 'Fintech', city: 'São Paulo', country: 'Brasil', website: 'nubank.com.br' },
  { name: 'C6 Bank', sector: 'Fintech', city: 'São Paulo', country: 'Brasil', website: 'c6bank.com.br' },
  { name: 'PicPay', sector: 'Fintech', city: 'São Paulo', country: 'Brasil', website: 'picpay.com' },
  { name: 'Moov', sector: 'Tecnología', city: 'São Paulo', country: 'Brasil', website: 'moov.com.br' },
  { name: 'Banco Safra', sector: 'Financiero', city: 'São Paulo', country: 'Brasil', website: 'safra.com.br' },
  { name: 'Rede D\'Or', sector: 'Salud', city: 'São Paulo', country: 'Brasil', website: 'reddor.com.br' },
  { name: 'RD Saúde', sector: 'Salud', city: 'São Paulo', country: 'Brasil', website: 'rdsaude.com.br' },
];

// ── Nombres realistas ──
const FIRST_NAMES_M = ['Roberto','Felipe','Andrés','Sebastián','Gonzalo','Matías','Tomás','Nicolás','Diego','Santiago','Martín','Lucas','Pablo','Emilio','Ricardo','Hernán','Marcelo','Raúl','Fernando','Javier','Miguel','Óscar','Ramiro','Agustín','Cristian','Eduardo','Gustavo','Héctor','Iván','Joaquín','Leandro','Marcos','Patricio','Rodrigo','Vicente','Walter','Adrián','Bruno','Carlos','Daniel','Esteban','Fabián','Gabriel','Hugo','Ignacio','Jorge','Kevin','Luis'];
const FIRST_NAMES_F = ['Carolina','Valentina','Daniela','Isabella','Camila','Sofía','María José','Luciana','Paula','Fernanda','Alejandra','Catalina','Elena','Gabriela','Jimena','Lorena','Natalia','Patricia','Renata','Silvia','Tatiana','Verónica','Ximena','Andrea','Beatriz','Claudia','Diana','Eva','Florence','Gloria','Helena','Inés','Juliana','Karina','Laura','Mónica','Nora','Olivia','Pilar','Rosa','Sara','Teresa','Úrsula','Vanesa','Wendy','Yolanda','Zoila','Mariana','Constanza'];
const LAST_NAMES = ['González','Rodríguez','López','Martínez','García','Hernández','Pérez','Sánchez','Ramírez','Torres','Flores','Rivera','Gómez','Díaz','Cortés','Vargas','Morales','Castro','Ortiz','Rojas','Medina','Chávez','Herrera','Aguilar','Jiménez','Ruiz','Domínguez','Romero','Reyes','Mendoza','Alvarez','Gutiérrez','Navarro','Molina','Campos','Ríos','Soto','Vega','Delgado','Aguirre'];
const POSITIONS = ['CEO','CTO','CFO','COO','VP de Ventas','Director Comercial','Head de Compras','Gerente General','Gerente de Tecnología','Director de Innovación','Head de Operaciones','VP de Finanzas','Director de Marketing','Gerente de Producto','Head de Partnerships','Director de Expansión','CIO','VP de Operaciones','Head de Estrategia','Director de Transformación Digital','Gerente Comercial','Head de Business Development','Director de Alianzas','VP de Growth','Gerente de Cuentas'];
const TAGS_POOL = ['enterprise','fintech','retail','tech','crypto','logistica','salud','gobierno','aeroespacial','food','construccion','telecom','media','automotriz','ecommerce','delivery','consultoria','coworking','inversiones','prop-tech','big-ticket','estrategico','expansion','renovacion','upsell','cross-sell','referral'];

// ── Helpers ──
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T,>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => +(Math.random() * (max - min) + min).toFixed(1);
const genId = () => Math.random().toString(36).substring(2, 11);

// Date helpers
const now = new Date('2026-06-25T12:00:00Z');
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
const dateStr = (d: Date) => d.toISOString().split('T')[0];

const US: {id:string;name:string;email:string;avatar:string;role:'admin'|'supervisor'|'vendedor'|'invitado';department:string;phone:string;status:'online'|'offline'|'ausente';createdAt:string}[] = [
  { id:'u1', name:'Alejandro Ruiz', email:'alejandro.ruiz@nexuscrm.com', avatar:'', role:'admin', department:'Dirección', phone:'+52 55 1234 5678', status:'online', createdAt:'2024-01-15T10:00:00Z' },
  { id:'u2', name:'María Fernanda López', email:'maria.lopez@nexuscrm.com', avatar:'', role:'supervisor', department:'Ventas', phone:'+52 55 2345 6789', status:'online', createdAt:'2024-02-01T09:00:00Z' },
  { id:'u3', name:'Carlos Andrés Mendoza', email:'carlos.mendoza@nexuscrm.com', avatar:'', role:'vendedor', department:'Ventas', phone:'+52 55 3456 7890', status:'online', createdAt:'2024-03-10T08:30:00Z' },
  { id:'u4', name:'Valentina Herrera', email:'valentina.herrera@nexuscrm.com', avatar:'', role:'vendedor', department:'Ventas', phone:'+52 55 4567 8901', status:'online', createdAt:'2024-03-15T11:00:00Z' },
  { id:'u5', name:'Diego Alejandro Torres', email:'diego.torres@nexuscrm.com', avatar:'', role:'vendedor', department:'Ventas', phone:'+52 55 5678 9012', status:'ausente', createdAt:'2024-04-01T09:00:00Z' },
  { id:'u6', name:'Sofía Camila Ramírez', email:'sofia.ramirez@nexuscrm.com', avatar:'', role:'supervisor', department:'Marketing', phone:'+52 55 6789 0123', status:'online', createdAt:'2024-02-15T10:00:00Z' },
  { id:'u7', name:'Mateo Sebastián García', email:'mateo.garcia@nexuscrm.com', avatar:'', role:'vendedor', department:'Ventas', phone:'+52 55 7890 1234', status:'online', createdAt:'2024-05-01T08:00:00Z' },
  { id:'u8', name:'Isabella Martínez', email:'isabella.martinez@nexuscrm.com', avatar:'', role:'invitado', department:'Soporte', phone:'+52 55 8901 2345', status:'offline', createdAt:'2024-06-01T09:30:00Z' },
];

const SOURCES: ('web'|'referido'|'linkedin'|'evento'|'cold_call'|'otro')[] = ['web','referido','linkedin','evento','cold_call','otro'];
const STATUSES: ('activo'|'inactivo'|'potencial'|'perdido')[] = ['activo','inactivo','potencial','perdido'];
const STAGES: ('lead'|'contactado'|'calificado'|'reunion'|'propuesta'|'negociacion'|'ganado'|'perdido')[] = ['lead','contactado','calificado','reunion','propuesta','negociacion','ganado','perdido'];
const ACT_TYPES: ('llamada'|'email'|'reunion'|'nota'|'cambio_estado'|'tarea'|'comentario')[] = ['llamada','email','reunion','nota','cambio_estado','tarea','comentario'];
const PRIORITIES: ('baja'|'media'|'alta'|'urgente')[] = ['baja','media','alta','urgente'];
const TASK_STATUSES: ('pendiente'|'en_progreso'|'completada'|'cancelada')[] = ['pendiente','en_progreso','completada','cancelada'];

// ── GENERATE 500 CLIENTS ──
function generateClients(): Client[] {
  const clients: Client[] = [];
  const usedCompanies = new Set<string>();

  for (let i = 0; i < 500; i++) {
    const isMale = Math.random() > 0.45;
    const firstName = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
    const lastName = pick(LAST_NAMES);

    // Use real companies for first 96, then mix with generated company names
    let company: string;
    let sector: string;
    let city: string;
    let country: string;

    if (i < COMPANIES.length) {
      company = COMPANIES[i].name;
      sector = COMPANIES[i].sector;
      city = COMPANIES[i].city;
      country = COMPANIES[i].country;
      usedCompanies.add(company);
    } else {
      // Generate additional realistic company names
      const prefixes = ['Tech','Digital','Global','Alpha','Nova','Prime','Sigma','Atlas','Vertex','Nexus','Zenith','Quantum','Apex','Pulse','Core','Link','Flow','Data','Cloud','Smart'];
      const suffixes = ['Solutions','Tech','Labs','Group','Systems','Corp','Holdings','Digital','Latam','Partners','Network','Services','Dynamics','Ventures','Innovation'];
      company = `${pick(prefixes)} ${pick(suffixes)} ${['MX','AR','BR','CO','CL','PE'][rand(0,5)]}`;
      sector = pick(['Tecnología','Consultoría','Servicios','Industria','Comercio','Financiero','Salud','Energía']);
      const cities = [
        {c:'Ciudad de México',co:'México'},{c:'Guadalajara',co:'México'},{c:'Monterrey',co:'México'},
        {c:'Buenos Aires',co:'Argentina'},{c:'Córdoba',co:'Argentina'},{c:'Rosario',co:'Argentina'},
        {c:'São Paulo',co:'Brasil'},{c:'Río de Janeiro',co:'Brasil'},{c:'Curitiba',co:'Brasil'},
        {c:'Bogotá',co:'Colombia'},{c:'Medellín',co:'Colombia'},{c:'Cali',co:'Colombia'},
        {c:'Santiago',co:'Chile'},{c:'Valparaíso',co:'Chile'},
        {c:'Lima',co:'Perú'},{c:'Quito',co:'Ecuador'},{c:'Montevideo',co:'Uruguay'},
        {c:'Panamá',co:'Panamá'},{c:'San José',co:'Costa Rica'},
      ];
      const loc = pick(cities);
      city = loc.c;
      country = loc.co;
    }

    const status = i < 50 ? 'perdido' : i < 120 ? 'potencial' : i < 350 ? 'activo' : Math.random() > 0.5 ? 'activo' : 'inactivo';
    const assignedTo = pick(US);
    const value = status === 'perdido' ? rand(0, 50000) : status === 'potencial' ? rand(5000, 80000) : rand(20000, 500000);
    const createdDaysAgo = rand(10, 540);
    const lastActDaysAgo = status === 'activo' ? rand(0, 14) : status === 'inactivo' ? rand(15, 90) : rand(1, 180);

    clients.push({
      id: `c${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@${company.toLowerCase().replace(/\s/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g,'')}.com`,
      phone: `+${rand(1,5)}${rand(10,99)} ${rand(100,9999)} ${rand(1000,9999)}`,
      company,
      position: pick(POSITIONS),
      address: `Av. ${pick(['Reforma','Insurgentes','Corrientes','Paulista','El Dorado','Providencia','9 de Julio','Santa Fe'])} ${rand(100,9999)}`,
      city,
      country,
      status,
      source: pick(SOURCES),
      tags: pickN(TAGS_POOL, rand(1, 4)),
      value,
      notes: '',
      assignedTo: assignedTo.id,
      createdAt: daysAgo(createdDaysAgo),
      updatedAt: daysAgo(Math.min(createdDaysAgo, lastActDaysAgo + rand(0, 5))),
      lastActivity: daysAgo(lastActDaysAgo),
    });
  }
  return clients;
}

// ── GENERATE 100 OPPORTUNITIES ──
function generateOpportunities(clients: Client[]): Opportunity[] {
  const opportunities: Opportunity[] = [];
  const stageWeights = [15, 18, 15, 12, 14, 10, 10, 6]; // lead,contactado,calificado,reunion,propuesta,negociacion,ganado,perdido
  const weightedStages: typeof STAGES = [];
  stageWeights.forEach((w, i) => { for (let j = 0; j < w; j++) weightedStages.push(STAGES[i]); });

  const activeClients = clients.filter(c => c.status === 'activo' || c.status === 'potencial');
  const titles = [
    'Licencia Enterprise CRM','Plataforma de Automatización','Servicios de Consultoría Digital',
    'Migración Cloud','Suite de Análisis de Datos','Integración API','Desarrollo a Medida',
    'Renovación Anual','Expansión Regional','Programa de Partnerships','Onboarding Enterprise',
    'Soporte Premium','Capacitación Equipo','Auditoría de Seguridad','Implementación ERP',
    'Dashboard Ejecutivo','Portal de Clientes','Sistema de Gestión Comercial','Chatbot Inteligente',
    'Plataforma de Pagos','Gestión de Inventario','Sistema de Logística','Plataforma E-Learning',
    'App Móvil Empresarial','Data Warehouse','BI y Reporting','Gestión de Proyectos','CRM Avanzado',
  ];

  for (let i = 0; i < 100; i++) {
    const client = activeClients[i % activeClients.length];
    const stage = pick(weightedStages);
    const baseValue = rand(15000, 250000);
    const probMap: Record<string, number> = { lead: 10, contactado: 25, calificado: 40, reunion: 55, propuesta: 65, negociacion: 80, ganado: 100, perdido: 0 };
    const assignedTo = pick(US);

    opportunities.push({
      id: `o${i + 1}`,
      title: pick(titles),
      clientId: client.id,
      clientName: client.company,
      value: stage === 'ganado' ? baseValue : baseValue * (1 + Math.random() * 0.5),
      stage,
      probability: probMap[stage] + rand(-5, 5),
      assignedTo: assignedTo.id,
      assignedName: assignedTo.name,
      expectedCloseDate: daysFromNow(stage === 'ganado' ? -rand(5, 60) : rand(3, 90)),
      createdAt: daysAgo(rand(10, 180)),
      updatedAt: daysAgo(rand(0, 7)),
      description: `Oportunidad comercial con ${client.company} para ${pick(titles).toLowerCase()}. Contacto principal: ${client.firstName} ${client.lastName}.`,
    });
  }
  return opportunities;
}

// ── GENERATE 1000 ACTIVITIES ──
function generateActivities(clients: Client[], opportunities: Opportunity[]): Activity[] {
  const activities: Activity[] = [];
  const actionVerbs: Record<string, string[]> = {
    llamada: ['Realizó llamada de seguimiento con', 'Llamó para confirmar reunión con', 'Discutió propuesta comercial con', 'Siguió up de propuesta con', 'Contactó por teléfono a'],
    email: ['Envío propuesta comercial a', 'Envió follow-up por email a', 'Compartió presentación ejecutiva con', 'Respondió consulta de', 'Envío cotización actualizada a'],
    reunion: ['Reunión de presentación con', 'Demo del producto a', 'Sesión de workshop con', 'Negociación de términos con', 'Review de progreso con'],
    cambio_estado: ['Movió oportunidad a Negociación:', 'Avanzó etapa a Propuesta:', 'Actualizó pipeline de', 'Cerró oportunidad con', 'Marcó como calificado a'],
    tarea: ['Completó tarea de seguimiento para', 'Programó llamada para', 'Agendó demo para', 'Actualizó CRM de', 'Preparó propuesta para'],
    nota: ['Registró nota de reunión con', 'Documentó requerimientos de', 'Actualizó información de', 'Agregó comentarios sobre', 'Archivó comunicación con'],
    comentario: ['Comentó sobre avance de', 'Dejó observación en oportunidad de', 'Actualizó notas internas de', 'Registró feedback de', 'Añadió contexto a'],
  };

  for (let i = 0; i < 1000; i++) {
    const type = pick(ACT_TYPES);
    const client = pick(clients);
    const user = pick(US.filter(u => u.role !== 'invitado'));
    const verbs = actionVerbs[type];
    const verb = pick(verbs);
    const hoursBack = rand(1, 720); // last 30 days
    const created = hoursAgo(hoursBack);
    const dateHour = new Date(created);

    let description = '';
    if (type === 'llamada') {
      description = `Duración: ${rand(5, 45)} min. Se discutieron próximos pasos y se agendó seguimiento.`;
    } else if (type === 'email') {
      description = `Asunto: ${pick(['Seguimiento propuesta','Actualización proyecto','Reunión agendada','Cotización','Información adicional'])}. CC: ${pick(US.filter(u=>u.id!==user.id)).name}.`;
    } else if (type === 'reunion') {
      description = `Duración: ${rand(30, 90)} min. Participantes: ${pickN(US, rand(1,3)).map(u=>u.name).join(', ')}. Se definieron acciones concretas.`;
    } else if (type === 'cambio_estado') {
      const opp = pick(opportunities.filter(o => o.clientId === client.id)) || pick(opportunities);
      description = `Oportunidad "${opp.title}" movida de ${pick(['Lead','Contactado','Calificado','Propuesta'])} a ${pick(['Calificado','Propuesta','Negociación','Ganado'])}. Motivo: ${pick(['Interés confirmado','Presupuesto aprobado','Reunión exitosa','Firma pendiente'])}.`;
    } else {
      description = `Detalle de la actividad registrada para seguimiento del equipo comercial.`;
    }

    activities.push({
      id: `a${i + 1}`,
      type,
      title: `${verb} ${client.company}`,
      description,
      clientId: client.id,
      clientName: client.company,
      userId: user.id,
      userName: user.name,
      createdAt: dateHour.toISOString(),
    });
  }

  // Sort by date descending
  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return activities;
}

// ── GENERATE 50 TASKS ──
function generateTasks(clients: Client[]): Task[] {
  const tasks: Task[] = [];
  const taskTitles = [
    'Llamar a {company} para seguimiento de propuesta',
    'Enviar cotización actualizada a {company}',
    'Preparar demo para {company}',
    'Agendar reunión con {company}',
    'Revisar contrato pendiente de {company}',
    'Actualizar CRM con información de {company}',
    'Enviar NDA a {company}',
    'Coordinar llamada con equipo técnico de {company}',
    'Preparar propuesta de valor para {company}',
    'Seguimiento de pago de {company}',
    'Confirmar requisitos de integración con {company}',
    'Programar workshop onboard con {company}',
    'Revisar SLA de {company}',
    'Enviar caso de éxito a {company}',
    'Preparar ROI para presentación a {company}',
    'Negociar términos de renovación con {company}',
    'Solicitar referencias comerciales a {company}',
    'Coordinar entrega con {company}',
    'Verificar firma de contrato de {company}',
    'Preparar informe mensual para {company}',
  ];

  for (let i = 0; i < 50; i++) {
    const client = pick(clients);
    const assignedTo = pick(US.filter(u => u.role !== 'invitado'));
    const status = i < 20 ? 'pendiente' : i < 30 ? 'en_progreso' : i < 45 ? 'completada' : 'cancelada';
    const priority = i < 5 ? 'urgente' : i < 15 ? 'alta' : i < 35 ? 'media' : 'baja';

    tasks.push({
      id: `t${i + 1}`,
      title: pick(taskTitles).replace('{company}', client.company),
      description: `Tarea asignada para gestión comercial con ${client.company}. Prioridad: ${priority}.`,
      assignedTo: assignedTo.id,
      assignedName: assignedTo.name,
      clientId: client.id,
      clientName: client.company,
      priority,
      status,
      dueDate: dateStr(new Date(now.getTime() + (status === 'completada' ? -rand(1, 10) : rand(0, 14)) * 86400000)),
      createdAt: daysAgo(rand(1, 30)),
      tags: pickN(['seguimiento','propuesta','contrato','demo','renovacion','onboard','soporte'], rand(0, 3)),
    });
  }
  return tasks;
}

// ── GENERATE 20+ CALENDAR EVENTS ──
function generateCalendarEvents(clients: Client[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const eventTypes: ('reunion'|'seguimiento'|'llamada'|'evento')[] = ['reunion','seguimiento','llamada','evento'];
  const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#3b82f6','#f97316','#06b6d4'];

  // 20 upcoming events + 5 past
  for (let i = 0; i < 25; i++) {
    const client = pick(clients.filter(c => c.status === 'activo'));
    const assignedTo = pick(US.filter(u => u.role !== 'invitado'));
    const type = pick(eventTypes);
    const isUpcoming = i < 20;
    const daysOffset = isUpcoming ? rand(0, 14) : -rand(1, 7);
    const eventDate = new Date(now.getTime() + daysOffset * 86400000);
    const startHour = rand(8, 17);
    const duration = type === 'reunion' ? rand(1, 2) : type === 'llamada' ? 1 : rand(1, 3);

    const titles: Record<string, string[]> = {
      reunion: [`Demo producto — ${client.company}`, `Review quarterly — ${client.company}`, `Negociación contrato — ${client.company}`, `Onboard — ${client.company}`],
      seguimiento: [`Follow-up ${client.company}`, `Revisión pipeline ${client.company}`, `Check-in semanal ${client.company}`],
      llamada: [`Llamada con ${client.company}`, `Seguimiento telefónico ${client.company}`],
      evento: [`Webinar: Transformación Digital`, `Q3 Sales Kickoff`, `Review mensual equipo`, `Capacitación producto`],
    };

    events.push({
      id: `ev${i + 1}`,
      title: pick(titles[type]),
      description: type === 'reunion' ? `Reunión programada con ${client.firstName} ${client.lastName} de ${client.company}` : `Seguimiento comercial con ${client.company}`,
      type,
      date: dateStr(eventDate),
      startTime: `${String(startHour).padStart(2, '0')}:00`,
      endTime: `${String(startHour + duration).padStart(2, '0')}:00`,
      clientId: client.id,
      clientName: client.company,
      assignedTo: assignedTo.id,
      assignedName: assignedTo.name,
      color: pick(colors),
    });
  }
  return events;
}

// ── GENERATE NOTES ──
function generateNotes(clients: Client[]): Note[] {
  const notes: Note[] = [];
  const noteTemplates = [
    { title: 'Notas de reunión — {company}', content: 'Se discutieron los requerimientos principales para la implementación. El equipo técnico necesita acceso a las APIs de integración. Se acordó enviar propuesta detallada antes del viernes.\n\nPuntos clave:\n- Integración con sistema ERP existente\n- Migración de datos históricos\n- Capacitación al equipo de 15 personas\n- Timeline estimado: 8 semanas\n- Presupuesto tentativo aprobado por CFO' },
    { title: 'Competencia — {company}', content: 'Analyzing competitive landscape. {company} is also evaluating Salesforce and HubSpot. Our key differentiators are:\n- Better Latam localization\n- Spanish-first support\n- Competitive pricing for enterprise\n- Faster implementation timeline' },
    { title: 'Estrategia de acercamiento — {company}', content: 'Plan de 30 días para cierre:\n1. Semana 1: Demo personalizada con datos reales\n2. Semana 2: Reunión con tomador de decisión\n3. Semana 3: Propuesta económica con descuento por volumen\n4. Semana 4: Negociación final y cierre' },
    { title: 'Historial de trato — {company}', content: 'Primer contacto en evento Latam Tech Summit 2025. Se mantuvo comunicación esporádica por LinkedIn. En marzo se reactivó el interés tras case de éxito publicado. Relación actual: cálida, responden dentro de 24h.' },
    { title: 'Requerimientos técnicos — {company}', content: 'Stack actual: SAP S/4HANA, Salesforce Sales Cloud, Google Workspace.\n\nNecesidades:\n- Migración parcial de Salesforce\n- Integración con SAP vía REST API\n- SSO con Okta\n- Data residency en Brasil (LGPD compliance)\n- SLA de 99.9% uptime' },
    { title: 'Oportunidad cross-sell — {company}', content: 'Además del módulo de ventas, muestran interés en:\n- Módulo de marketing automation\n- Analytics avanzado\n- Portal de partners\n\nEstimación de valor total: 2.3x el deal inicial. Programar demo conjunta la próxima semana.' },
  ];

  for (let i = 0; i < 15; i++) {
    const client = pick(clients);
    const template = pick(noteTemplates);
    const createdBy = pick(US);

    notes.push({
      id: `n${i + 1}`,
      title: template.title.replace('{company}', client.company),
      content: template.content.replace(/{company}/g, client.company),
      clientId: client.id,
      clientName: client.company,
      createdBy: createdBy.id,
      createdByName: createdBy.name,
      createdAt: daysAgo(rand(1, 60)),
      updatedAt: daysAgo(rand(0, 5)),
      tags: pickN(['estrategia','tecnico','competencia','seguimiento','cierre'], rand(1, 3)),
      isPinned: i < 3,
    });
  }
  return notes;
}

// ── GENERATE NOTIFICATIONS ──
function generateNotifications(clients: Client[]): Notification[] {
  return [
    { id: 'not1', type: 'warning', title: 'Propuesta vence mañana', message: `La propuesta para ${clients[0].company} vence el 26 de junio. Acción requerida.`, read: false, createdAt: hoursAgo(2) },
    { id: 'not2', type: 'success', title: 'Contrato firmado', message: `${clients[1].company} firmó contrato de licencia enterprise por $180,000.`, read: false, createdAt: hoursAgo(4) },
    { id: 'not3', type: 'info', title: 'Nueva reunión programada', message: `Demo con ${clients[2].company} confirmada para mañana a las 10:00.`, read: false, createdAt: hoursAgo(6) },
    { id: 'not4', type: 'error', title: 'Tarea vencida', message: `Seguimiento de ${clients[3].company} está 2 días vencida.`, read: false, createdAt: hoursAgo(8) },
    { id: 'not5', type: 'warning', title: 'Cliente sin actividad', message: `${clients[4].company} lleva 14 días sin contacto. Riesgo de abandono.`, read: false, createdAt: hoursAgo(12) },
    { id: 'not6', type: 'success', title: 'Oportunidad avanzada', message: `Carlos Mendoza movió ${clients[5].company} a etapa de Negociación.`, read: true, createdAt: daysAgo(1) },
    { id: 'not7', type: 'info', title: 'Objetivo mensual', message: 'El equipo ha alcanzado el 80% del objetivo mensual. Faltan $135,000. Quedan 5 días.', read: true, createdAt: daysAgo(1) },
    { id: 'not8', type: 'warning', title: 'Pipeline en riesgo', message: `3 oportunidades por más de $200K no tienen actividad en los últimos 7 días.`, read: true, createdAt: daysAgo(2) },
  ];
}

// ── GENERATE AUTOMATIONS ──
function generateAutomations(): Automation[] {
  return [
    { id: 'au1', name: 'Seguimiento automático de leads', description: 'Cuando un lead no tiene actividad en 48h, crea tarea de seguimiento y asigna al vendedor responsable.', trigger: 'client_inactive', action: 'create_task', isActive: true, createdAt: daysAgo(90), runCount: 147 },
    { id: 'au2', name: 'Notificación de cambio de etapa', description: 'Envía notificación al supervisor cuando una oportunidad supera los $50K y cambia de etapa.', trigger: 'stage_change', action: 'send_notification', isActive: true, createdAt: daysAgo(75), runCount: 89 },
    { id: 'au3', name: 'Asignación automática por región', description: 'Asigna automáticamente nuevos leads al vendedor de la región correspondiente basado en ciudad/país.', trigger: 'new_lead', action: 'assign_user', isActive: true, createdAt: daysAgo(60), runCount: 234 },
    { id: 'au4', name: 'Escalamiento de clientes inactivos', description: 'Si un cliente activo no tiene actividad en 14 días, notifica al supervisor y crea tarea de reactivación.', trigger: 'client_inactive', action: 'send_notification', isActive: true, createdAt: daysAgo(45), runCount: 56 },
    { id: 'au5', name: 'Avance automático de etapa', description: 'Cuando se completa una tarea de "enviar propuesta", mueve automáticamente la oportunidad a etapa Propuesta.', trigger: 'task_completed', action: 'change_stage', isActive: false, createdAt: daysAgo(30), runCount: 12 },
    { id: 'au6', name: 'Bienvenida a nuevos leads', description: 'Envía notificación al equipo cuando se registra un nuevo lead con valor potencial mayor a $30K.', trigger: 'new_lead', action: 'send_notification', isActive: true, createdAt: daysAgo(20), runCount: 78 },
  ];
}

// ── GENERATE AI INSIGHTS ──
function generateAIInsights(clients: Client[], opportunities: Opportunity[]): AIInsight[] {
  const activeOpps = opportunities.filter(o => !['ganado','perdido'].includes(o.stage));
  const topOpps = [...activeOpps].sort((a,b) => b.value - a.value).slice(0, 5);

  return [
    { id: 'ai1', type: 'alert', title: `${topOpps[0]?.clientName || 'Banco Santander'} — Riesgo de abandono`, description: `Este cliente lleva 12 días sin ninguna actividad registrada. El último contacto fue un email de seguimiento que no obtuvo respuesta. La probabilidad de cierre bajó del 85% al 72% en la última semana. Se recomienda programar llamada esta semana con el tomador de decisión.`, confidence: 87, clientId: topOpps[0]?.clientId, clientName: topOpps[0]?.clientName, createdAt: hoursAgo(3) },
    { id: 'ai2', type: 'suggestion', title: `${topOpps[1]?.clientName || 'MercadoLibre'} — Alta probabilidad de cierre`, description: `El contacto abrió dos correos de propuesta en las últimas 24h y respondió al último follow-up en menos de 2 horas. Señales de compra fuertes. Acción recomendada: enviar propuesta formal con términos de descuento por cierre anticipado.`, confidence: 82, clientId: topOpps[1]?.clientId, clientName: topOpps[1]?.clientName, createdAt: hoursAgo(5) },
    { id: 'ai3', type: 'prediction', title: `Pipeline Q3 — Proyección de $2.1M`, description: `Basado en la velocidad de cierre actual ($285K/semana) y el valor ponderado del pipeline activo ($3.2M), se proyecta cierre de Q3 en $2.1M. Esto representa un 18% sobre la meta trimestral. Los principales contribuyentes son oportunidades en etapa de Negociación.`, confidence: 74, createdAt: hoursAgo(8) },
    { id: 'ai4', type: 'alert', title: `${topOpps[2]?.clientName || 'Nubank'} — Propuesta sin respuesta`, description: `La propuesta enviada hace 5 días no ha sido abierta según los tracking de email. El patrón es similar a 3 oportunidades perdidas en Q1. Recomendación: contactar por teléfono al decision maker y ofrecer una llamada rápida de 15 minutos para resolver dudas.`, confidence: 71, clientId: topOpps[2]?.clientId, clientName: topOpps[2]?.clientName, createdAt: hoursAgo(12) },
    { id: 'ai5', type: 'suggestion', title: `Oportunidad de cross-sell con ${topOpps[3]?.clientName || 'Globant'}`, description: `Este cliente utiliza actualmente solo el módulo de ventas. Análisis de uso muestra alta adopción (92% DAU). Clientes con perfil similar que agregan el módulo de marketing incrementan su LTV en 45%.`, confidence: 68, clientId: topOpps[3]?.clientId, clientName: topOpps[3]?.clientName, createdAt: daysAgo(1) },
    { id: 'ai6', type: 'prediction', title: `Mejor momento para contactar leads`, description: `Análisis de 847 interacciones muestra que los martes y jueves entre 10:00-11:30 tienen 2.3x más tasa de respuesta. Los leads contactados en horario de almuerzo (13:00-14:00) tienen la tasa más baja (8%).`, confidence: 91, createdAt: daysAgo(1) },
    { id: 'ai7', type: 'suggestion', title: `Renovación en riesgo — ${clients[10]?.company || 'Rappi'}`, description: `El contrato actual vence en 23 días y no hay registros de negociación de renovación. El cliente ha reducido su uso en un 15% en las últimas 2 semanas, lo que históricamente es un indicador de churn con 78% de precisión.`, confidence: 78, clientId: clients[10]?.id, clientName: clients[10]?.company, createdAt: daysAgo(2) },
    { id: 'ai8', type: 'alert', title: `Objetivo mensual en riesgo`, description: `Con 5 días hábiles restantes, el equipo necesita cerrar $135,000 adicionales para alcanzar la meta de $700,000. Hay 4 oportunidades en Negociación por un total de $380,000. Si se cierra al menos 1, la meta se cumple.`, confidence: 65, createdAt: hoursAgo(1) },
  ];
}

// ── CHART DATA ──
function generateChartData(opportunities: Opportunity[], clients: Client[]): {
  kpiData: KPIData[];
  monthlySalesData: ChartDataPoint[];
  pipelineData: { stage: string; value: number; count: number }[];
  teamPerformanceData: { name: string; revenue: number; deals: number; activities: number }[];
} {
  const wonOpps = opportunities.filter(o => o.stage === 'ganado');
  const totalRevenue = wonOpps.reduce((s, o) => s + o.value, 0);
  const activePipeline = opportunities.filter(o => !['ganado','perdido'].includes(o.stage)).reduce((s, o) => s + o.value, 0);
  const wonThisMonth = wonOpps.filter(o => new Date(o.updatedAt).getMonth() === now.getMonth()).length;

  const kpiData: KPIData[] = [
    { label: 'Ingresos del Mes', value: '$565,000', change: 12.4, changeLabel: 'vs. mes anterior', icon: 'dollar-sign' },
    { label: 'Nuevos Clientes', value: '23', change: 8.2, changeLabel: 'vs. mes anterior', icon: 'users' },
    { label: 'Deals Cerrados', value: String(wonThisMonth || 7), change: 15.0, changeLabel: 'vs. mes anterior', icon: 'target' },
    { label: 'Pipeline Activo', value: formatCompact(activePipeline), change: -3.2, changeLabel: 'vs. semana pasada', icon: 'bar-chart' },
    { label: 'Tasa de Cierre', value: '34.2%', change: 5.1, changeLabel: 'vs. mes anterior', icon: 'trending-up' },
    { label: 'Actividades Hoy', value: '47', change: 22.0, changeLabel: 'vs. ayer', icon: 'activity' },
  ];

  const months = ['Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May','Jun'];
  const monthlySalesData: ChartDataPoint[] = months.map((name, i) => ({
    name,
    value: rand(280000, 520000),
    value2: rand(220000, 440000),
  }));

  const stageLabels = ['Lead','Contactado','Calificado','Reunión','Propuesta','Negociación','Ganado','Perdido'];
  const stageKeys = ['lead','contactado','calificado','reunion','propuesta','negociacion','ganado','perdido'];
  const pipelineData = stageKeys.map((stage, i) => {
    const ops = opportunities.filter(o => o.stage === stage);
    return { stage: stageLabels[i], value: ops.reduce((s, o) => s + o.value, 0), count: ops.length };
  });

  const sellers = US.filter(u => u.role === 'vendedor' || u.role === 'supervisor');
  const teamPerformanceData = sellers.map(u => {
    const uOpps = opportunities.filter(o => o.assignedTo === u.id);
    return {
      name: u.name.split(' ')[0],
      revenue: uOpps.filter(o => o.stage === 'ganado').reduce((s, o) => s + o.value, 0) || rand(80000, 200000),
      deals: uOpps.filter(o => o.stage === 'ganado').length || rand(2, 8),
      activities: rand(40, 120),
    };
  });

  return { kpiData, monthlySalesData, pipelineData, teamPerformanceData };
}

function formatCompact(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

// ── MAIN ──
function main() {
  console.log('Generando dataset profesional...');

  const clients = generateClients();
  console.log(`  ${clients.length} clientes generados`);

  const opportunities = generateOpportunities(clients);
  console.log(`  ${opportunities.length} oportunidades generadas`);

  const activities = generateActivities(clients, opportunities);
  console.log(`  ${activities.length} actividades generadas`);

  const tasks = generateTasks(clients);
  console.log(`  ${tasks.length} tareas generadas`);

  const calendarEvents = generateCalendarEvents(clients);
  console.log(`  ${calendarEvents.length} eventos de calendario generados`);

  const notes = generateNotes(clients);
  console.log(`  ${notes.length} notas generadas`);

  const notifications = generateNotifications(clients);
  console.log(`  ${notifications.length} notificaciones generadas`);

  const automations = generateAutomations();
  console.log(`  ${automations.length} automatizaciones generadas`);

  const aiInsights = generateAIInsights(clients, opportunities);
  console.log(`  ${aiInsights.length} insights IA generados`);

  const { kpiData, monthlySalesData, pipelineData, teamPerformanceData } = generateChartData(opportunities, clients);
  console.log(`  Datos de gráficos generados`);

  // Output as TypeScript module
  console.log('\n=== OUTPUT START ===');
  const output = `import type { User, Client, Opportunity, Task, Activity, Note, CalendarEvent, Notification, Automation, AIInsight, ChartDataPoint, KPIData } from '@/types';

export const users: User[] = ${JSON.stringify(US, null, 2)};

export const clients: Client[] = ${JSON.stringify(clients, null, 2)};

export const opportunities: Opportunity[] = ${JSON.stringify(opportunities, null, 2)};

export const activities: Activity[] = ${JSON.stringify(activities, null, 2)};

export const tasks: Task[] = ${JSON.stringify(tasks, null, 2)};

export const calendarEvents: CalendarEvent[] = ${JSON.stringify(calendarEvents, null, 2)};

export const notes: Note[] = ${JSON.stringify(notes, null, 2)};

export const notifications: Notification[] = ${JSON.stringify(notifications, null, 2)};

export const automations: Automation[] = ${JSON.stringify(automations, null, 2)};

export const aiInsights: AIInsight[] = ${JSON.stringify(aiInsights, null, 2)};

export const kpiData: KPIData[] = ${JSON.stringify(kpiData, null, 2)};

export const monthlySalesData: ChartDataPoint[] = ${JSON.stringify(monthlySalesData, null, 2)};

export const pipelineData: { stage: string; value: number; count: number }[] = ${JSON.stringify(pipelineData, null, 2)};

export const teamPerformanceData: { name: string; revenue: number; deals: number; activities: number }[] = ${JSON.stringify(teamPerformanceData, null, 2)};
`;

  // Write to file
  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.resolve(__dirname, '../src/data/mockData.ts');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`\nArchivo escrito: ${outPath}`);
  console.log('=== OUTPUT END ===');
}

main().catch(console.error);