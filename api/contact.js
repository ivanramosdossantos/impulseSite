import { createHash } from 'node:crypto';

const ORIGIN = 'https://useimpulse.com.br';
const MAX_BODY = 12000;
const json = (res, status, data) => { res.statusCode=status; res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data)); };
const clean = (v, max) => typeof v === 'string' && v.trim().length <= max ? v.trim() : null;
const hash = (s) => createHash('sha256').update(s).digest('hex');
const LIMIT_SCRIPT = [
  "local a=redis.call('INCR',KEYS[1])",
  "if a==1 then redis.call('EXPIRE',KEYS[1],3600) end",
  "local b=redis.call('INCR',KEYS[2])",
  "if b==1 then redis.call('EXPIRE',KEYS[2],86400) end",
  "local c=redis.call('INCR',KEYS[3])",
  "if c==1 then redis.call('EXPIRE',KEYS[3],86400) end",
  "return {a,b,c}"
].join('\n');

async function rateLimit(ip, email) {
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token || !process.env.CONTACT_IP_HASH_SALT) throw new Error('limiter_not_configured');
  const today = new Date().toISOString().slice(0,10);
  const perIp = hash(process.env.CONTACT_IP_HASH_SALT + ':' + ip);
  const perEmail = hash(process.env.CONTACT_IP_HASH_SALT + ':' + email.toLowerCase());
  const url = base.replace(/\/$/,'');
  const response=await fetch(url, {
    method:'POST', headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify(['EVAL',LIMIT_SCRIPT,'3','contact:ip:'+perIp,'contact:global:'+today,'contact:email:'+perEmail]),
    signal:AbortSignal.timeout(4000)
  });
  if(!response.ok) throw new Error('limiter_error');
  const data=await response.json();
  if(!Array.isArray(data.result) || data.result.length!==3 || data.result.some(n=>!Number.isInteger(n))) throw new Error('limiter_invalid');
  return data.result[0] <= 3 && data.result[1] <= 30 && data.result[2] <= 3;
}

async function verifyTurnstile(token, ip) {
  const secret=process.env.TURNSTILE_SECRET_KEY;
  if(!secret) throw new Error('turnstile_not_configured');
  const form=new URLSearchParams({secret,response:token,remoteip:ip});
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
    method:'POST',body:form,signal:AbortSignal.timeout(5000)
  });
  if(!r.ok) throw new Error('turnstile_unavailable');
  const result=await r.json();
  return result.success===true && ['useimpulse.com.br','www.useimpulse.com.br'].includes(result.hostname) && result.action==='contact';
}

export default async function handler(req,res) {
  res.setHeader('Access-Control-Allow-Origin',ORIGIN);
  res.setHeader('Vary','Origin');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST') return json(res,405,{error:'method_not_allowed'});
  if(req.headers.origin!==ORIGIN) return json(res,403,{error:'origin_not_allowed'});
  if(!String(req.headers['content-type']||'').startsWith('application/json')) return json(res,415,{error:'invalid_content_type'});
  if(Number(req.headers['content-length']||0)>MAX_BODY) return json(res,413,{error:'payload_too_large'});
  const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim();
  if(!ip || ip.length>64) return json(res,400,{error:'invalid_request'});
  let input=req.body;
  if(typeof input==='string'){if(Buffer.byteLength(input)>MAX_BODY)return json(res,413,{error:'payload_too_large'});try{input=JSON.parse(input)}catch{return json(res,400,{error:'invalid_json'})}}
  if(!input || typeof input!=='object' || Array.isArray(input))return json(res,400,{error:'invalid_json'});
  if(Buffer.byteLength(JSON.stringify(input))>MAX_BODY)return json(res,413,{error:'payload_too_large'});
  const name=clean(input.name,120),email=clean(input.email,254),company=clean(input.company,150),
    team=clean(input.team,60),plan=clean(input.plan,60),message=clean(input.message,3000),
    turnstile=clean(input.turnstile,2048),website=clean(input.website,250);
  if(!name||!email||!company||!message||!turnstile||website===null||team===null||plan===null|| !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    return json(res,400,{error:'invalid_fields'});
  }
  if(website) return json(res,200,{ok:true}); // honeypot; no send
  if(!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL || process.env.CONTACT_SENDING_ENABLED !== 'true'){
    return json(res,503,{error:'contact_unavailable'});
  }
  try {
    if(!(await verifyTurnstile(turnstile,ip))) return json(res,403,{error:'verification_failed'});
    if(!(await rateLimit(ip,email))) return json(res,429,{error:'rate_limit_exceeded'});
    const payload={
      from:process.env.CONTACT_FROM_EMAIL,
      to:[process.env.CONTACT_TO_EMAIL],
      subject:'Novo contato comercial — Impulse',
      reply_to:email,
      text:['Novo contato comercial', 'Nome: '+name,'E-mail: '+email,'Empresa: '+company,'Equipe: '+team,'Plano: '+plan,'Mensagem:',message].join('\n')
    };
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify(payload),signal:AbortSignal.timeout(8000)
    });
    if(!response.ok){console.error('contact_delivery_failed',response.status);return json(res,502,{error:'delivery_unavailable'});}
    return json(res,200,{ok:true});
  }catch(e){
    console.error('contact_blocked',e instanceof Error?e.message:'unknown');
    return json(res,503,{error:'contact_unavailable'});
  }
}
