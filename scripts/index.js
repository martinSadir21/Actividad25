// "base de datos" que nos dieron (solo para la práctica)
const baseDeDatos = {
  usuarios: [
    { id: 1, name: "Steve Jobs", email: "steve@jobs.com", password: "Steve123" },
    { id: 2, name: "Ervin Howell", email: "shanna@melissa.tv", password: "Ervin345" },
    { id: 3, name: "Clementine Bauch", email: "nathan@yesenia.net", password: "Floppy39876" },
    { id: 4, name: "Patricia Lebsack", email: "julianne.oconner@kory.org", password: "MysuperPassword345" },
  ],
};

// agarro todo lo que necesito del html
const emailInput = document.querySelector("#email-input");
const passInput = document.querySelector("#password-input");
const loginBtn = document.querySelector(".login-btn");
const loader = document.querySelector("#loader");
const errorBox = document.querySelector("#error-container");
const main = document.querySelector("main");
const form = document.querySelector("form");

// validación simple de email
function esEmailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

// simulo que el server tarda
function esperar(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// busco usuario en la "bd" por email y pass
function buscarUsuario(email, pass) {
  return baseDeDatos.usuarios.find(u => u.email === email && u.password === pass);
}

// guardo en localStorage SOLO lo necesario
function guardarSesion(user) {
  const limpio = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem("usuario", JSON.stringify(limpio));
}

// leo usuario guardado (si hay)
function leerSesion() {
  const raw = localStorage.getItem("usuario");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// limpio sesión
function borrarSesion() {
  localStorage.removeItem("usuario");
}

// armo la pantalla de bienvenida con el botón de cerrar sesión
function renderBienvenida(nombre) {
  main.innerHTML = `
    <h1>Bienvenido al sitio 😀</h1>
    <p>Hola ${nombre}</p>
    <button id="logout-btn" class="login-btn" type="button">Cerrar sesión</button>
  `;

  const logoutBtn = document.querySelector("#logout-btn");
  logoutBtn.addEventListener("click", () => {
    // borro todo, aviso y recargo para volver al form
    borrarSesion();
    alert("Sesión cerrada correctamente.");
    location.reload();
  });
}

// muestro/oculto loader y deshabilito botón mientras "carga"
function setCargando(on) {
  if (on) {
    loader.classList.remove("hidden");
    loginBtn.disabled = true;
  } else {
    loader.classList.add("hidden");
    loginBtn.disabled = false;
  }
}

// al cargar la página, si ya estaba logueado, muestro directo la bienvenida
window.addEventListener("DOMContentLoaded", () => {
  const sesion = leerSesion();
  if (sesion) {
    renderBienvenida(sesion.name);
  }
});

// click en "Inciar sesión"
loginBtn.addEventListener("click", async () => {
  // limpio errores viejos
  errorBox.textContent = "";
  errorBox.classList.add("hidden");

  const email = emailInput.value.trim();
  const pass = passInput.value;

  // validaciones básicas
  if (!esEmailValido(email) || pass.length < 5) {
    errorBox.textContent = "Alguno de los datos ingresados son incorrectos";
    errorBox.classList.remove("hidden");
    return;
  }

  // muestro "Iniciando Sesión..." y simulo 3s
  setCargando(true);
  await esperar(3000);

  // chequeo credenciales con la "bd"
  const user = buscarUsuario(email, pass);

  if (!user) {
    errorBox.textContent = "Alguno de los datos ingresados son incorrectos";
    errorBox.classList.remove("hidden");
    setCargando(false);
    return;
  }

  // si está ok, guardo sesión (sin password) y muestro bienvenida
  guardarSesion(user);
  renderBienvenida(user.name);
  setCargando(false);
});
