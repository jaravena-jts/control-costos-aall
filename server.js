'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const PORT = Number(process.env.PORT || 3000);
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'javier.aravena@usach.cl').trim().toLowerCase();
const UPDATER_EMAIL = (process.env.UPDATER_EMAIL || 'jgonzalez@ingevec.cl').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const UPDATER_PASSWORD = process.env.UPDATER_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(48).toString('hex');
const PROD = process.env.NODE_ENV === 'production';
const MAX_BODY = 30 * 1024 * 1024;

fs.mkdirSync(DATA_DIR, { recursive: true });
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const DASHBOARD_FILE = path.join(DATA_DIR, 'dashboard.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function atomicWrite(file, value) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value), 'utf8');
  fs.renameSync(tmp, file);
}
function settings() { return readJson(SETTINGS_FILE, { blocked: false, message: 'Sistema temporalmente bloqueado por administración.' }); }
function history() { return readJson(HISTORY_FILE, []); }
function json(res, status, payload, headers={}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', ...headers });
  res.end(body);
}
function text(res, status, body, type='text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type':type, 'Cache-Control':'no-store' });
  res.end(body);
}
function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('='); if (i < 0) continue;
    out[part.slice(0,i).trim()] = decodeURIComponent(part.slice(i+1).trim());
  }
  return out;
}
function signSession(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}
function verifySession(token) {
  try {
    const [data, sig] = String(token || '').split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    const a = Buffer.from(sig), b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) return null;
    const p = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!p.exp || Date.now() > p.exp) return null;
    return p;
  } catch { return null; }
}
function session(req) { return verifySession(parseCookies(req).aall_session); }
function setSession(res, user) {
  const token = signSession({ email:user.email, role:user.role, exp:Date.now()+8*60*60*1000 });
  const flags = [`aall_session=${encodeURIComponent(token)}`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=28800'];
  if (PROD) flags.push('Secure');
  res.setHeader('Set-Cookie', flags.join('; '));
}
function clearSession(res) {
  const flags = ['aall_session=', 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (PROD) flags.push('Secure');
  res.setHeader('Set-Cookie', flags.join('; '));
}
function safeEqual(a,b) {
  const ha=crypto.createHash('sha256').update(String(a)).digest();
  const hb=crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha,hb);
}
function configuredUser(email, password) {
  const e = String(email || '').trim().toLowerCase();
  if (e === ADMIN_EMAIL && ADMIN_PASSWORD && safeEqual(password, ADMIN_PASSWORD)) return { email:ADMIN_EMAIL, role:'admin' };
  if (e === UPDATER_EMAIL && UPDATER_PASSWORD && safeEqual(password, UPDATER_PASSWORD)) return { email:UPDATER_EMAIL, role:'updater' };
  return null;
}
function isAdmin(u){ return u?.role === 'admin'; }
function canUpdate(u){ return u?.role === 'admin' || u?.role === 'updater'; }

const loginAttempts = new Map();
function allowLogin(ip) {
  const now=Date.now(), x=loginAttempts.get(ip)||{start:now,count:0};
  if (now-x.start>10*60*1000) { x.start=now; x.count=0; }
  x.count++; loginAttempts.set(ip,x); return x.count <= 10;
}
function readBody(req, limit=MAX_BODY) {
  return new Promise((resolve,reject)=>{
    let size=0, chunks=[];
    req.on('data', c=>{ size+=c.length; if(size>limit){ reject(Object.assign(new Error('Carga demasiado grande.'),{status:413})); req.destroy(); } else chunks.push(c); });
    req.on('end', ()=>resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJsonBody(req) {
  const buf=await readBody(req); if(!buf.length) return {};
  try { return JSON.parse(buf.toString('utf8')); } catch { throw Object.assign(new Error('JSON inválido.'),{status:400}); }
}
function secureHeaders(res) {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
}
function serveStatic(req,res,urlPath) {
  let rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  rel = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '');
  const file = path.join(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return false;
  const ext=path.extname(file).toLowerCase();
  const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'}[ext]||'application/octet-stream';
  res.writeHead(200, {'Content-Type':mime, 'Cache-Control': ext==='.html'?'no-store':'public, max-age=3600'});
  fs.createReadStream(file).pipe(res); return true;
}
function validateDataset(d) {
  if (!d || !Array.isArray(d.rows)) return 'Dataset inválido: faltan filas.';
  if (d.rows.length > 20000) return 'Dataset inválido: demasiadas filas.';
  for (const r of d.rows.slice(0,20)) if (typeof r.amount !== 'number') return 'Dataset inválido: monto no numérico.';
  return '';
}

const server=http.createServer(async (req,res)=>{
  secureHeaders(res);
  const u = new URL(req.url, `http://${req.headers.host||'localhost'}`);
  const pathname=u.pathname;
  const me=session(req);
  const cfg=settings();

  try {
    if (pathname === '/health') return json(res,200,{ok:true,blocked:cfg.blocked});

    if (pathname === '/api/session' && req.method==='GET') {
      return json(res,200,{user:me?{email:me.email,role:me.role}:null,blocked:cfg.blocked,blockMessage:cfg.message,configured:{admin:!!ADMIN_PASSWORD,updater:!!UPDATER_PASSWORD}});
    }
    if (pathname === '/api/login' && req.method==='POST') {
      const ip=req.socket.remoteAddress||'unknown';
      if(!allowLogin(ip)) return json(res,429,{error:'Demasiados intentos. Intenta nuevamente en unos minutos.'});
      const body=await readJsonBody(req); const found=configuredUser(body.email,body.password);
      if(!found) return json(res,401,{error:'Usuario o clave incorrectos, o credencial no configurada en Railway.'});
      setSession(res,found); return json(res,200,{ok:true,user:found,blocked:cfg.blocked});
    }
    if (pathname === '/api/logout' && req.method==='POST') {
      clearSession(res); return json(res,200,{ok:true});
    }
    if (pathname === '/api/dashboard' && req.method==='GET') {
      if(cfg.blocked && !isAdmin(me)) return json(res,423,{error:'blocked',message:cfg.message});
      const d=readJson(DASHBOARD_FILE,null); return json(res,200,{dataset:d});
    }
    if (pathname === '/api/dashboard' && req.method==='POST') {
      if(!canUpdate(me)) return json(res,403,{error:'No tienes permisos para actualizar información.'});
      if(cfg.blocked && !isAdmin(me)) return json(res,423,{error:'La página está bloqueada por administración.'});
      const body=await readJsonBody(req); const err=validateDataset(body); if(err) return json(res,400,{error:err});
      const now=new Date().toISOString();
      body.meta = {...(body.meta||{}), updatedAt:now, updatedBy:me.email, version:7};
      atomicWrite(DASHBOARD_FILE,body);
      const hist=history(); hist.unshift({at:now,by:me.email,fileName:body.meta.fileName||'',rows:body.rows.length,total:body.lmSummary?.Total||0}); atomicWrite(HISTORY_FILE,hist.slice(0,50));
      return json(res,200,{ok:true,meta:body.meta});
    }
    if (pathname === '/api/admin' && req.method==='GET') {
      if(!isAdmin(me)) return json(res,403,{error:'Acceso exclusivo del administrador.'});
      const d=readJson(DASHBOARD_FILE,null);
      return json(res,200,{settings:cfg,history:history().slice(0,20),datasetMeta:d?.meta||null,lmSummary:d?.lmSummary||null,sheetSummary:d?.sheetSummary||null,users:[{email:ADMIN_EMAIL,role:'admin',configured:!!ADMIN_PASSWORD},{email:UPDATER_EMAIL,role:'updater',configured:!!UPDATER_PASSWORD}]});
    }
    if (pathname === '/api/admin/block' && req.method==='POST') {
      if(!isAdmin(me)) return json(res,403,{error:'Acceso exclusivo del administrador.'});
      const body=await readJsonBody(req); const next={blocked:!!body.blocked,message:String(body.message||'Sistema temporalmente bloqueado por administración.').slice(0,300)}; atomicWrite(SETTINGS_FILE,next); return json(res,200,{ok:true,settings:next});
    }

    if (req.method==='GET' || req.method==='HEAD') {
      if (serveStatic(req,res,pathname)) return;
    }
    return json(res,404,{error:'Ruta no encontrada.'});
  } catch(e) {
    console.error(e); if(res.headersSent){res.end();return;} return json(res,e.status||500,{error:e.message||'Error interno.'});
  }
});

server.listen(PORT,()=>{
  console.log(`Control AALL 2026 escuchando en puerto ${PORT}`);
  if(!ADMIN_PASSWORD) console.warn('ADMIN_PASSWORD no configurada: el administrador no podrá iniciar sesión.');
  if(!UPDATER_PASSWORD) console.warn('UPDATER_PASSWORD no configurada: el actualizador no podrá iniciar sesión.');
});
