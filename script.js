/* Edit business information and form integration here. */
const SITE_CONFIG = {
  phoneDisplay: '(843) 399-1374',
  phoneLink: '+18433991374',
  address: '7300 SC-90, Longs, SC 29568',
  weekdayHours: '9:00 AM–5:00 PM',
  opens: '09:00',
  closes: '17:00',
  // Add a real HTTPS form endpoint (for example your own server or Formspree).
  // Empty means requests are NOT sent. No fabricated success messages.
  formEndpoint: ''
};
const directions = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(SITE_CONFIG.address);
document.querySelectorAll('[data-phone]').forEach(a => a.href = 'tel:' + SITE_CONFIG.phoneLink);
document.querySelectorAll('[data-phone-text]').forEach(el => el.textContent = SITE_CONFIG.phoneDisplay);
document.querySelectorAll('[data-directions]').forEach(a => a.href = directions);
document.querySelectorAll('[data-weekday-hours]').forEach(el => el.textContent = SITE_CONFIG.weekdayHours);
const schema = { '@context': 'https://schema.org', '@type': 'AutoRepair', name: 'KT & Sons Transmissions Auto Repair', telephone: SITE_CONFIG.phoneLink, foundingDate: '1973', address: { '@type': 'PostalAddress', streetAddress: '7300 SC-90', addressLocality: 'Longs', addressRegion: 'SC', postalCode: '29568', addressCountry: 'US' }, areaServed: ['Longs', 'North Myrtle Beach', 'Little River', 'Myrtle Beach', 'Horry County'], openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: SITE_CONFIG.opens, closes: SITE_CONFIG.closes }] };
const structuredData = document.createElement('script'); structuredData.type = 'application/ld+json'; structuredData.textContent = JSON.stringify(schema); document.head.append(structuredData);
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){ navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open navigation'); }
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); navigation.classList.toggle('is-open',open); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', e => { if(e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true'){closeMenu();toggle.focus();} });
document.addEventListener('click', e => {if(!e.target.closest('.header')) closeMenu();});
window.matchMedia('(min-width:901px)').addEventListener('change', closeMenu);
// Logo fallback keeps the site usable if the supplied logo has not been copied yet.
document.querySelectorAll('.brand img').forEach(img => { const fallback = () => {img.hidden = true; img.nextElementSibling.hidden = false;}; img.addEventListener('error',fallback); if(img.complete && img.naturalWidth === 0) fallback(); });
const form = document.querySelector('#service-form');
const notice = document.querySelector('#form-notice');
const status = document.querySelector('#form-status');
const submit = document.querySelector('#submit-request');
if(SITE_CONFIG.formEndpoint){notice.textContent = 'Submitting a request does not confirm an appointment. Please wait for the shop to contact you.';}
form.addEventListener('submit',async event => {
  event.preventDefault();
  if(!form.reportValidity()) return;
  if(!SITE_CONFIG.formEndpoint){ status.textContent = 'Your request has NOT been sent. Online requests are not connected yet. Please call ' + SITE_CONFIG.phoneDisplay + ' to discuss service.'; return; }
  if(form.elements.website.value) return;
  submit.disabled = true; submit.textContent = 'Sending…'; status.textContent = '';
  try { const response = await fetch(SITE_CONFIG.formEndpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}}); if(!response.ok) throw new Error('Submission failed'); status.textContent = 'Your request was submitted. This is not a confirmed appointment. Please call for immediate assistance.'; form.reset(); }
  catch(error){status.textContent = 'Your request could not be sent. Please call ' + SITE_CONFIG.phoneDisplay + '. Your appointment has not been booked.';}
  finally{submit.disabled = false;submit.textContent = 'Request service ↗';}
});
