import "../assets/styles/contact.css";
import { navigate } from '../router.js';



// Helper funcional para crear elementos
const $ = (tag, props = {}, ...children) => {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'class') {
      el.className = v;
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(el.style, v);
    } else if (k === 'for') {
      el.htmlFor = v;
    } else {
      el.setAttribute(k, v);
    }
  });
  children.flat().forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
};

const isValidEmail = email => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

function showError(input, message) {
  const error = document.createElement('div');
  error.className = 'input-error';
  error.style.color = '#ef4444';
  error.style.fontSize = '0.95rem';
  error.style.marginTop = '2px';
  error.textContent = message;
  input.style.borderColor = '#ef4444';
  input.parentNode.appendChild(error);
}

function showSuccess(message) {
  const msg = document.createElement('div');
  msg.className = 'contact-success';
  msg.textContent = message;
  msg.style.background = '#10b981';
  msg.style.color = 'white';
  msg.style.padding = '1rem';
  msg.style.borderRadius = '8px';
  msg.style.margin = '1rem 0';
  msg.style.textAlign = 'center';
  document.body.prepend(msg);
  setTimeout(() => msg.remove(), 3500);
}

export default function contact(container) {
  container.innerHTML = '';

  const layout = $('div', { class: 'contact-layout' },
    // Botón para ir a home
    $('button', {
      class: 'contact-back-btn',
      onclick: () => {
        console.log('Botón Go Back pulsado');
        navigate('/home');
      }
    }, '← Go Back'),
    // Título y descripción
    $('h1', { class: 'contact-title' }, 'Contact Us'),
    $('p', { class: 'contact-desc' }, 'We would love to hear from you! Fill out the form or use the info below.'),
    // Contenedor principal
    $('div', { class: 'contact-main' },
      // Formulario
      (() => {
        const nameInput = $('input', { type: 'text', placeholder: 'Your name', required: true });
        const emailInput = $('input', { type: 'email', placeholder: 'Your email', required: true });
        const msgInput = $('textarea', { placeholder: 'Your message', required: true, rows: 5 });
        const form = $('form', { class: 'contact-form', onsubmit: e => {
          e.preventDefault();
          form.querySelectorAll('.input-error').forEach(el => el.remove());
          [nameInput, emailInput, msgInput].forEach(i => i.style.borderColor = '');
          let valid = true;
          if (!nameInput.value.trim()) { showError(nameInput, 'Name is required'); valid = false; }
          if (!isValidEmail(emailInput.value.trim())) { showError(emailInput, 'Enter a valid email'); valid = false; }
          if (!msgInput.value.trim()) { showError(msgInput, 'Message is required'); valid = false; }
          if (valid) {
            form.reset();
            showSuccess('Your message has been sent! (simulated)');
          }
        } },
          $('label', {}, 'Name', nameInput),
          $('label', {}, 'Email', emailInput),
          $('label', {}, 'Message', msgInput),
          $('button', { type: 'submit' }, 'Send')
        );
        return form;
      })(),
      // Datos de contacto y mapa
      $('div', { class: 'contact-info-map' },
        $('div', { class: 'contact-info' },
          $('h2', {}, 'Contact Information'),
          $('p', {}, 'Email: info@yourdomain.com'),
          $('p', {}, 'Phone: +1 234 567 890'),
          $('p', {}, 'Address: 123 Main St, Your City, Country')
        ),
        $('div', { class: 'contact-map' },
          $('iframe', {
            src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019019858735!2d-122.4194151846816!3d37.7749297797597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7e2b1b1b%3A0x4a0b8b8b8b8b8b8b!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1514524647889',
            width: '100%',
            height: '200',
            style: { border: 0 },
            allowfullscreen: '',
            loading: 'lazy',
            referrerpolicy: 'no-referrer-when-downgrade'
          })
        )
      )
    )
  );
  container.appendChild(layout);
} 

