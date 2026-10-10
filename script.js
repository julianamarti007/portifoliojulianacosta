const topbar = document.querySelector("#topbar");
const cursorGlow = document.querySelector(".cursor-glow");
const particles = document.querySelector(".particles");


window.addEventListener("scroll", () => {
  topbar.classList.toggle("scrolled", window.scrollY > 80);
});

window.addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});


for (let i = 0; i < 35; i++) {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.animationDelay = `${Math.random() * 8}s`;
  particle.style.animationDuration = `${5 + Math.random() * 8}s`;
  particle.style.opacity = `${0.15 + Math.random() * 0.45}`;
  particles.appendChild(particle);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const parallaxElement = document.querySelector("[data-parallax]");

window.addEventListener("scroll", () => {
  if (!parallaxElement) return;
  const speed = Number(parallaxElement.dataset.parallax);
  const movement = window.scrollY * speed;
  parallaxElement.style.transform = `translateY(${movement}px)`;
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;

    card.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});


document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);

    button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

const themeToggle = document.querySelector("#themeToggle");

function setTheme(theme, save = true) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
  );
  if (save) {
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }
}

setTheme(document.documentElement.getAttribute("data-theme") || "dark", false);

themeToggle.addEventListener("click", () => {
  const atual = document.documentElement.getAttribute("data-theme");
  setTheme(atual === "dark" ? "light" : "dark");
});

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const telefoneInput = document.querySelector("#telefone");

const modal = document.querySelector("#confirmModal");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalCancel = document.querySelector("#modalCancel");
const modalConfirm = document.querySelector("#modalConfirm");

let dadosPendentes = null;
let ultimoFoco = null;

function mascaraTelefone(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

telefoneInput.addEventListener("input", () => {
  telefoneInput.value = mascaraTelefone(telefoneInput.value);
});

function abrirModal(dados) {
  dadosPendentes = dados;
  document.querySelector("#sumNome").textContent = dados.nome;
  document.querySelector("#sumEmail").textContent = dados.email;
  document.querySelector("#sumTelefone").textContent = dados.telefone;
  document.querySelector("#sumMensagem").textContent = dados.mensagem;

  ultimoFoco = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalConfirm.focus();
}

function fecharModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (ultimoFoco) ultimoFoco.focus();
}

modalCancel.addEventListener("click", fecharModal);
modalBackdrop.addEventListener("click", fecharModal);

document.addEventListener("keydown", (event) => {
  if (modal.hidden) return;

  if (event.key === "Escape") fecharModal();

  if (event.key === "Tab") {
    const focaveis = [modalCancel, modalConfirm];
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  const email = document.querySelector("#email").value.trim();
  const telefone = telefoneInput.value.trim();
  const mensagem = document.querySelector("#mensagem").value.trim();
  const digitos = telefone.replace(/\D/g, "");

  if (!nome || !email || !telefone || !mensagem) {
    formStatus.textContent = "Preencha todos os campos.";
    return;
  }

  if (digitos.length < 10) {
    formStatus.textContent = "Digite o telefone completo, com DDD. Exemplo: (31) 99999-9999.";
    telefoneInput.focus();
    return;
  }

  formStatus.textContent = "";
  abrirModal({ nome, email, telefone, mensagem });
});

modalConfirm.addEventListener("click", () => {
  if (!dadosPendentes) return;

  const { nome, email, telefone, mensagem } = dadosPendentes;
  const destino = "juliana.marti325z@gmail.com";

  const assunto = encodeURIComponent(`Contato pelo portfólio - ${nome}`);
  const corpo = encodeURIComponent(
    `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\n\nMensagem:\n${mensagem}`
  );

  fecharModal();
  formStatus.textContent = "Abrindo seu aplicativo de e-mail...";
  window.location.href = `mailto:${destino}?subject=${assunto}&body=${corpo}`;

  dadosPendentes = null;
  setTimeout(() => contactForm.reset(), 800);
});
