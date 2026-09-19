const form = document.querySelector('#brief-form');
const steps = [...document.querySelectorAll('.step')];
const nextButton = document.querySelector('#next-btn');
const backButton = document.querySelector('#back-btn');
const progressBar = document.querySelector('#progress-bar');
const progressText = document.querySelector('#progress-text');
const stepCount = document.querySelector('#step-count');
const stepLabel = document.querySelector('#step-label');
const errorMessage = document.querySelector('#error-message');
let currentStep = 0;
const labels = ['EMPECEMOS','TU NORTE','EL FORMATO','LAS PERSONAS','LA ATMÓSFERA','LA VOZ VISUAL','LA DIRECCIÓN','LA ESTRUCTURA','TUS REFERENCIAS','CASI LISTO','RESUMEN'];

function setHiddenValue(name, value) { form.elements[name].value = value; }
function showStep(index) {
  currentStep = index;
  steps.forEach((step, i) => step.classList.toggle('active', i === index));
  const isSummary = index === steps.length - 1;
  const percent = isSummary ? 100 : Math.round(((index + 1) / 10) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
  stepCount.textContent = isSummary ? 'RESUMEN' : `${index + 1} / 10`;
  stepLabel.textContent = isSummary ? 'RESUMEN FINAL — LISTO PARA ENVIAR' : `${String(index + 1).padStart(2, '0')} / 10 — ${labels[index]}`;
  backButton.disabled = index === 0;
  nextButton.innerHTML = isSummary ? '<span>Enviar brief</span> ↗' : '<span>Siguiente</span> →';
  errorMessage.textContent = '';
  if (isSummary) buildSummary();
  const heading = steps[index].querySelector('h1,h2');
  heading?.focus?.();
}

document.querySelectorAll('.choice-grid').forEach(grid => {
  grid.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    grid.querySelectorAll('button').forEach(item => item.classList.toggle('selected', item === button));
    setHiddenValue(grid.dataset.required, button.dataset.value);
    if (grid.dataset.required === 'siteType') {
      const otherField = document.querySelector('#other-site-type-wrap');
      otherField.classList.toggle('visible', button.dataset.value === 'Otro');
      if (button.dataset.value !== 'Otro') form.elements.siteTypeOther.value = '';
    }
  });
});
document.querySelectorAll('.font-list').forEach(list => {
  list.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    list.querySelectorAll('button').forEach(item => item.classList.toggle('selected', item === button));
    setHiddenValue(list.dataset.required, button.dataset.value);
    typePreview.style.fontFamily = getComputedStyle(button.querySelector('.font-sample')).fontFamily;
  });
});
const typeControls = document.querySelector('.type-controls');
const typePreview = document.querySelector('#type-preview');
typeControls.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  const isRegular = button.dataset.value === 'Regular';
  if (isRegular) typeControls.querySelectorAll('button').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', item === button); });
  else { typeControls.querySelector('[data-value="Regular"]').classList.remove('selected'); typeControls.querySelector('[data-value="Regular"]').setAttribute('aria-pressed','false'); button.classList.toggle('selected'); button.setAttribute('aria-pressed', button.classList.contains('selected')); }
  const values = [...typeControls.querySelectorAll('.selected')].map(item => item.dataset.value);
  if (!values.length) { const regular = typeControls.querySelector('[data-value="Regular"]'); regular.classList.add('selected'); regular.setAttribute('aria-pressed','true'); values.push('Regular'); }
  setHiddenValue('typeTreatment', values.join(', '));
  typePreview.style.fontWeight = values.includes('Negrita') ? '800' : '400';
  typePreview.style.fontStyle = values.includes('Itálica') ? 'italic' : 'normal';
  typePreview.style.textTransform = values.includes('Mayúsculas') ? 'uppercase' : 'none';
});
document.querySelectorAll('.style-options').forEach(list => {
  list.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    const selected = list.querySelectorAll('.selected');
    if (!button.classList.contains('selected') && selected.length >= Number(list.dataset.max)) return;
    button.classList.toggle('selected');
    setHiddenValue(list.dataset.required, [...list.querySelectorAll('.selected')].map(item => item.dataset.value).join(', '));
  });
});
const domainOptions = document.querySelector('.domain-options');
domainOptions.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  domainOptions.querySelectorAll('button').forEach(item => item.classList.toggle('selected', item === button));
  setHiddenValue('domainChoice', button.dataset.value);
  const hasDomain = button.dataset.value === 'Sí, ya tengo dominio';
  document.querySelector('#domain-input-wrap').classList.toggle('visible', hasDomain);
  document.querySelector('#domain-help').classList.toggle('visible', !hasDomain);
  if (!hasDomain) form.elements.domainName.value = '';
});

const colorPicker = document.querySelector('#color-picker');
const colorPreview = document.querySelector('#color-preview');
const colorHex = document.querySelector('#color-hex');
const colorWheel = document.querySelector('#color-wheel');
const wheelKnob = document.querySelector('#wheel-knob');
const toneSpectrum = document.querySelector('#tone-spectrum');
const toneKnob = document.querySelector('#tone-knob');
function setColor(hex) { colorPicker.value = hex; colorPreview.style.background = hex; colorPreview.querySelector('span').style.color = isLight(hex) ? '#151318' : '#fff'; colorHex.textContent = hex.toUpperCase(); }
function isLight(hex) { const rgb = hex.match(/[a-f\d]{2}/gi)?.map(value => parseInt(value, 16)) || [0,0,0]; return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 160; }
colorPicker.addEventListener('input', () => setColor(colorPicker.value));
document.querySelectorAll('.swatches button').forEach(button => button.addEventListener('click', () => setColor(button.dataset.color)));
function hslToHex(hue, saturation, lightness) {
  saturation /= 100; lightness /= 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = lightness - chroma / 2;
  const [r, g, b] = hue < 60 ? [chroma,x,0] : hue < 120 ? [x,chroma,0] : hue < 180 ? [0,chroma,x] : hue < 240 ? [0,x,chroma] : hue < 300 ? [x,0,chroma] : [chroma,0,x];
  return `#${[r,g,b].map(value => Math.round((value + m) * 255).toString(16).padStart(2, '0')).join('')}`;
}
function pickWheel(event) {
  const rect = colorWheel.getBoundingClientRect(); const x = event.clientX - rect.left - rect.width / 2; const y = event.clientY - rect.top - rect.height / 2;
  const distance = Math.min(1, Math.hypot(x, y) / (rect.width / 2)); if (distance < .24) return;
  const hue = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;
  wheelKnob.style.left = `${50 + Math.cos((hue - 90) * Math.PI / 180) * distance * 50}%`;
  wheelKnob.style.top = `${50 + Math.sin((hue - 90) * Math.PI / 180) * distance * 50}%`;
  setColor(hslToHex(hue, Math.max(42, distance * 100), 58));
}
colorWheel.addEventListener('pointerdown', event => { colorWheel.setPointerCapture(event.pointerId); pickWheel(event); });
colorWheel.addEventListener('pointermove', event => { if (event.buttons) pickWheel(event); });
function pickTone(event) { const rect = toneSpectrum.getBoundingClientRect(); const pos = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)); const shade = Math.round((1 - pos) * 255).toString(16).padStart(2, '0'); toneKnob.style.left = `${pos * 100}%`; setColor(`#${shade}${shade}${shade}`); }
toneSpectrum.addEventListener('pointerdown', event => { toneSpectrum.setPointerCapture(event.pointerId); pickTone(event); });
toneSpectrum.addEventListener('pointermove', event => { if (event.buttons) pickTone(event); });
const fileInput = document.querySelector('#reference-files');
fileInput.addEventListener('change', () => { const files = [...fileInput.files]; document.querySelector('#file-names').textContent = files.length ? files.slice(0, 5).map(file => file.name).join(' · ') : ''; });

function selectedSections() { return [...document.querySelectorAll('.checks input:checked')].map(input => input.value).join(', '); }
function validateStep() {
  const active = steps[currentStep];
  if (currentStep === 7) setHiddenValue('sections', selectedSections());
  if (currentStep === 2 && form.elements.siteType.value === 'Otro' && !form.elements.siteTypeOther.value.trim()) { errorMessage.textContent = 'Cuéntanos qué tipo de sitio tienes en mente.'; form.elements.siteTypeOther.focus(); return false; }
  if (currentStep === 9 && form.elements.domainChoice.value === 'Sí, ya tengo dominio' && !form.elements.domainName.value.trim()) { errorMessage.textContent = 'Escribe tu dominio para poder continuar.'; form.elements.domainName.focus(); return false; }
  if (currentStep === 9) {
    const email = form.elements.email.value.trim(); const phone = form.elements.phone.value.trim();
    if (!email && !phone) { errorMessage.textContent = 'Escribe un correo o un número celular para poder contactarte.'; form.elements.email.focus(); return false; }
  }
  const required = [...active.querySelectorAll('[required]')];
  const invalid = required.find(input => !input.value.trim() || !input.checkValidity());
  if (invalid) { errorMessage.textContent = invalid.type === 'email' ? 'Escribe un correo electrónico válido para continuar.' : 'Completa esta parte para poder continuar.'; invalid.focus(); return false; }
  return true;
}
function buildSummary() {
  setHiddenValue('sections', selectedSections());
  const data = new FormData(form);
  const files = [...fileInput.files].map(file => file.name).join(', ');
  const contact = [data.get('email'), data.get('phone')].filter(Boolean).join(' · ');
  const siteType = data.get('siteType') === 'Otro' ? `Otro · ${data.get('siteTypeOther')}` : data.get('siteType');
  const project = data.get('projectName') ? `${data.get('projectName')} · ${data.get('idea')}` : data.get('idea');
  const domain = data.get('domainChoice') === 'Sí, ya tengo dominio' ? data.get('domainName') : data.get('domainChoice');
  const items = [['Proyecto',project],['Objetivo',data.get('goal')],['Tipo de sitio',siteType],['Público',data.get('audience')],['Color',`<span class="summary-color"><i style="--summary-color:${data.get('color')}"></i>${data.get('color').toUpperCase()}</span>`],['Tipografía',`${data.get('font')} · ${data.get('typeTreatment')}`],['Estilo',data.get('visualStyle')],['Secciones',data.get('sections')],['Dominio',domain],['Referencias',data.get('references') || files || '—'],['Contacto',`${data.get('name')} · ${contact}`]];
  document.querySelector('#summary').innerHTML = items.map(([label,value]) => `<dl class="summary-item"><dt>${label}</dt><dd>${value}</dd></dl>`).join('');
}
async function submitBrief() {
  nextButton.disabled = true;
  nextButton.innerHTML = '<span>Guardando…</span>';
  errorMessage.textContent = '';
  try {
    const response = await fetch('/api/briefs', { method: 'POST', body: new FormData(form) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No pudimos guardar tu brief.');
    document.querySelector('#success-modal').classList.add('open');
    document.querySelector('#success-modal').setAttribute('aria-hidden','false');
  } catch (error) {
    errorMessage.textContent = error.message || 'No pudimos guardar tu brief. Inténtalo de nuevo.';
  } finally {
    nextButton.disabled = false;
    nextButton.innerHTML = '<span>Enviar brief</span> ↗';
  }
}
nextButton.addEventListener('click', () => { if (currentStep === steps.length - 1) { submitBrief(); return; } if (validateStep()) showStep(currentStep + 1); });
backButton.addEventListener('click', () => { if (currentStep > 0) showStep(currentStep - 1); });
document.querySelector('#restart-btn').addEventListener('click', () => { form.reset(); setColor('#7656ff'); toneKnob.style.left = '50%'; wheelKnob.style.left = '82%'; wheelKnob.style.top = '20%'; document.querySelectorAll('.selected').forEach(item => item.classList.remove('selected')); document.querySelector('.font-option').classList.add('selected'); document.querySelector('.type-control').classList.add('selected'); setHiddenValue('font','DM Sans'); setHiddenValue('typeTreatment','Regular'); typePreview.removeAttribute('style'); document.querySelector('#other-site-type-wrap').classList.remove('visible'); document.querySelector('#domain-input-wrap').classList.remove('visible'); document.querySelector('#domain-help').classList.remove('visible'); document.querySelector('#file-names').textContent = ''; document.querySelectorAll('.checks input[value="Inicio"], .checks input[value="Contacto"]').forEach(input => input.checked = true); document.querySelector('#success-modal').classList.remove('open'); document.querySelector('#success-modal').setAttribute('aria-hidden','true'); showStep(0); });
form.addEventListener('keydown', event => { if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') { event.preventDefault(); nextButton.click(); } });
showStep(0);
