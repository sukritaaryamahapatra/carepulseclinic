// CarePulse Clinic — main.js
// Loads shared header/footer, wires nav, scroll reveals, testimonial
// slider, and the appointment form submission.

(function () {
  async function includePartials() {
    const slots = document.querySelectorAll('[data-include]');
    await Promise.all(
      Array.from(slots).map(async (slot) => {
        const src = slot.getAttribute('data-include');
        try {
          const res = await fetch(src);
          slot.innerHTML = await res.text();
        } catch (err) {
          console.error('Could not load partial', src, err);
        }
      })
    );
  }

  function markActiveNav() {
    const page = document.body.getAttribute('data-page');
    if (!page) return;
    const link = document.querySelector(`.nav-links a[data-nav="${page}"]`);
    if (link) link.setAttribute('aria-current', 'page');
  }

  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function wireNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  function wireHeaderScrollShadow() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 18px -12px rgba(18,48,44,0.25)' : 'none';
    });
  }

  function wireRevealObserver() {
    const targets = document.querySelectorAll('.reveal, .pulse-divider');
    if (!('IntersectionObserver' in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    targets.forEach((t) => io.observe(t));
  }

  function wireTestimonials() {
    const wrap = document.querySelector('[data-testimonials]');
    if (!wrap) return;
    const quoteEl = wrap.querySelector('.testimonial-quote');
    const personEl = wrap.querySelector('.testimonial-person');
    const dotsWrap = wrap.querySelector('.testimonial-dots');
    let items;
    try {
      items = JSON.parse(wrap.getAttribute('data-testimonials'));
    } catch (e) {
      return;
    }
    let index = 0;

    function render() {
      quoteEl.textContent = `"${items[index].quote}"`;
      personEl.textContent = `${items[index].name} — ${items[index].role}`;
      dotsWrap.querySelectorAll('button').forEach((b, i) => {
        b.setAttribute('aria-current', String(i === index));
      });
    }

    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        index = i;
        render();
      });
      dotsWrap.appendChild(dot);
    });

    render();
    setInterval(() => {
      index = (index + 1) % items.length;
      render();
    }, 6000);
  }

  function wireAccordionSingleOpen() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item) other.removeAttribute('open');
          });
        }
      });
    });
  }

  // This site has no backend server, so the booking form composes a
  // pre-filled email instead of posting to an API. Submitting opens
  // the visitor's email app with every field already written in —
  // they just review and hit send.
  function wireAppointmentForm() {
    const form = document.getElementById('appointment-form');
    if (!form) return;
    const status = document.getElementById('form-status');
    const clinicEmail = 'hello@carepulseclinic.example';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredOk = form.checkValidity();
      if (!requiredOk) {
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      const subject = `Appointment request — ${data.department}`;
      const bodyLines = [
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        data.email ? `Email: ${data.email}` : null,
        `Department: ${data.department}`,
        `Preferred date: ${data.date}`,
        `Preferred time: ${data.time}`,
        data.message ? `Notes: ${data.message}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const mailtoLink = `mailto:${clinicEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;

      window.location.href = mailtoLink;

      status.textContent = `Your email app should now open with everything filled in for you — just hit send. If nothing opens, call us directly at +91 12345 67890.`;
      status.className = 'show ok';
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await includePartials();
    markActiveNav();
    setYear();
    wireNavToggle();
    wireHeaderScrollShadow();
    wireRevealObserver();
    wireTestimonials();
    wireAccordionSingleOpen();
    wireAppointmentForm();
  });
})();
