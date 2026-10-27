/* Impulse website analytics — consent-first, no third-party requests until approval. */
(()=>{'use strict';
 const containerId=String(window.IMPULSE_GTM_ID||'').trim();
 const configured=/^GTM-[A-Z0-9]{4,}$/i.test(containerId);
 const consentKey='impulse.analytics.consent.v1';
 const allowEvents=new Set(['trial_click','demo_view','generate_lead','pricing_view','contact_click']);
 let loaded=false;
 let consent='unset';
 try{consent=localStorage.getItem(consentKey)||'unset';}catch{}
 function hasConsent(){return configured&&consent==='accepted';}
 function track(event,attributes={}){
  if(!hasConsent()||!allowEvents.has(event))return;
  const data={event};
  if(['pedido','desconto','integracao'].includes(attributes.scenario))data.scenario=attributes.scenario;
  if(['hero','demo','pricing','final','nav'].includes(attributes.location))data.location=attributes.location;
  if(attributes.method==='site_contact')data.method='site_contact';
  window.dataLayer=window.dataLayer||[];window.dataLayer.push(data);
 }
 window.ImpulseAnalytics=Object.freeze({track});
 if(!configured){document.getElementById('analytics-preferences')?.setAttribute('hidden','');return;} // Safe fail-closed: no ID, no banner, no analytics.
 function loadTag(){if(loaded||!hasConsent())return;loaded=true;
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
  const script=document.createElement('script');script.async=true;
  script.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(containerId);
  document.head.appendChild(script);
 }
 function store(choice){consent=choice;try{localStorage.setItem(consentKey,choice)}catch{};render();if(choice==='accepted')loadTag();}
 function clearGoogleCookies(){
  const cookies=document.cookie.split(';').map(s=>s.trim().split('=')[0]).filter(name=>/^_ga($|_)|^_gid$|^_gat($|_)/.test(name));
  const hosts=[location.hostname,'.'+location.hostname,location.hostname.replace(/^[^.]+\./,''),'.'+location.hostname.replace(/^[^.]+\./,'')];
  for(const name of cookies)for(const domain of hosts){document.cookie=name+'=; Max-Age=0; path=/; SameSite=Lax; domain='+domain;}
 }
 const banner=document.getElementById('analytics-consent');const prefs=document.getElementById('analytics-preferences');
 function render(){if(banner)banner.hidden=consent!=='unset';}
 document.getElementById('analytics-accept')?.addEventListener('click',()=>store('accepted'));
 document.getElementById('analytics-reject')?.addEventListener('click',()=>{const wasActive=hasConsent();store('rejected');if(wasActive){clearGoogleCookies();location.reload();}});
 prefs?.addEventListener('click',()=>{const wasActive=hasConsent();consent='unset';try{localStorage.removeItem(consentKey)}catch{};if(wasActive){clearGoogleCookies();location.reload();return;}render();if(banner&&!banner.hidden)document.getElementById('analytics-reject')?.focus();});
 if(consent==='accepted')loadTag();render();
 document.querySelectorAll('a[href*="/trial?plan=trial"]').forEach(a=>a.addEventListener('click',()=>track('trial_click',{location:a.closest('#inicio')?'hero':a.closest('#demonstracao')?'demo':a.closest('#planos')?'pricing':'final'})));
 document.querySelectorAll('a[href="#contato"]').forEach(a=>a.addEventListener('click',()=>track('contact_click',{location:a.closest('#planos')?'pricing':'nav'})));
 const plans=document.getElementById('planos');if(plans&&'IntersectionObserver' in window){let seen=false;const observer=new IntersectionObserver(entries=>{if(!seen&&entries.some(e=>e.isIntersecting)){seen=true;track('pricing_view');observer.disconnect()}},{threshold:0.25});observer.observe(plans)}
})();
