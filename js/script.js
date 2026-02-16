const STORAGE_KEYS = {
  CLASES: "mygymbro_clases",
  INSCRIPCIONES: "mygymbro_inscripciones",
  USUARIO: "mygymbro_usuario",
};

function guardarEnStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function leerDeStorage(clave, valorPorDefecto) {
  const dato = localStorage.getItem(clave);
  if (dato === null) return valorPorDefecto;
  return JSON.parse(dato);
}

function borrarStorageCompleto() {
  localStorage.removeItem(STORAGE_KEYS.CLASES);
  localStorage.removeItem(STORAGE_KEYS.INSCRIPCIONES);
  localStorage.removeItem(STORAGE_KEYS.USUARIO);
}

function getClasesIniciales() {
  return [
    { id: 1, nombre: "CrossFit", cupo: 3 },
    { id: 2, nombre: "Funcional", cupo: 2 },
    { id: 3, nombre: "Spinning", cupo: 1 },
  ];
}

function crearInscripcion(persona, claseNombre) {
  return {
    persona: persona,
    clase: claseNombre,
  };
}

let clases = leerDeStorage(STORAGE_KEYS.CLASES, getClasesIniciales());
let inscripciones = leerDeStorage(STORAGE_KEYS.INSCRIPCIONES, []);
let usuarioActual = leerDeStorage(STORAGE_KEYS.USUARIO, "");

const formUsuario = document.querySelector("#form-usuario");
const inputUsuario = document.querySelector("#input-usuario");
const usuarioActualEl = document.querySelector("#usuario-actual");
const msgUsuario = document.querySelector("#msg-usuario");

const salida = document.querySelector("#salida");
const msgAcciones = document.querySelector("#msg-acciones");

const formInscripcion = document.querySelector("#form-inscripcion");
const selectClase = document.querySelector("#select-clase");
const msgInscripcion = document.querySelector("#msg-inscripcion");

function setMensaje(el, texto) {
  el.textContent = texto;
}

function renderUsuario() {
  if (usuarioActual === "") {
    usuarioActualEl.textContent = "-";
    return;
  }
  usuarioActualEl.textContent = usuarioActual;
}

function renderSelectClases() {
  selectClase.innerHTML = "";

  for (const clase of clases) {
    const option = document.createElement("option");
    option.value = String(clase.id);

    if (clase.cupo > 0) {
      option.textContent = `${clase.id}) ${clase.nombre} (Cupo: ${clase.cupo})`;
    } else {
      option.textContent = `${clase.id}) ${clase.nombre} (SIN CUPO)`;
    }

    selectClase.appendChild(option);
  }
}

function renderClasesEnSalida() {
  if (clases.length === 0) {
    salida.innerHTML = `<p class="muted">No hay clases cargadas.</p>`;
    return;
  }

  let html = "<ul class='list'>";
  for (const clase of clases) {
    html += `<li><strong>${clase.nombre}</strong> — Cupo: ${clase.cupo}</li>`;
  }
  html += "</ul>";

  salida.innerHTML = html;
}

function renderMisInscripcionesEnSalida() {
  if (usuarioActual === "") {
    salida.innerHTML = `<p class="muted">Primero guardá tu usuario.</p>`;
    return;
  }

  const mias = [];
  for (const insc of inscripciones) {
    if (insc.persona === usuarioActual) {
      mias.push(insc);
    }
  }

  if (mias.length === 0) {
    salida.innerHTML = `<p class="muted">Todavía no tenés inscripciones.</p>`;
    return;
  }

  let html = `<p><strong>Inscripciones de ${usuarioActual}:</strong></p><ul class="list">`;
  for (const insc of mias) {
    html += `<li>${insc.clase}</li>`;
  }
  html += "</ul>";

  salida.innerHTML = html;
}

function buscarClasePorId(idBuscado) {
  for (const clase of clases) {
    if (clase.id === idBuscado) return clase;
  }
  return null;
}

function inscribirUsuarioEnClase(idClase) {
  if (usuarioActual === "") {
    setMensaje(
      msgInscripcion,
      "Primero guardá tu usuario para poder inscribirte.",
    );
    return;
  }

  const clase = buscarClasePorId(idClase);

  if (clase === null) {
    setMensaje(msgInscripcion, "No existe una clase con ese ID.");
    return;
  }

  if (clase.cupo <= 0) {
    setMensaje(msgInscripcion, `No hay cupo disponible para ${clase.nombre}.`);
    return;
  }

  inscripciones.push(crearInscripcion(usuarioActual, clase.nombre));
  clase.cupo = clase.cupo - 1;

  guardarEnStorage(STORAGE_KEYS.INSCRIPCIONES, inscripciones);
  guardarEnStorage(STORAGE_KEYS.CLASES, clases);

  setMensaje(msgInscripcion, `¡Listo! Te anotaste en ${clase.nombre}.`);
  renderSelectClases();
  renderMisInscripcionesEnSalida();
}

function ejecutarAccion(action) {
  setMensaje(msgAcciones, "");

  switch (action) {
    case "VER_CLASES":
      renderClasesEnSalida();
      break;

    case "MIS_INSCRIPCIONES":
      renderMisInscripcionesEnSalida();
      break;

    case "RESET":
      borrarStorageCompleto();
      clases = getClasesIniciales();
      inscripciones = [];
      usuarioActual = "";

      renderUsuario();
      renderSelectClases();
      salida.innerHTML = `<p class="muted">Datos reseteados. Listo para empezar de nuevo.</p>`;

      setMensaje(msgUsuario, "");
      setMensaje(msgInscripcion, "");
      setMensaje(msgAcciones, "Se reseteó todo correctamente.");
      break;

    default:
      setMensaje(msgAcciones, "Acción inválida.");
      break;
  }
}

formUsuario.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = inputUsuario.value;

  if (nombre === "") {
    setMensaje(msgUsuario, "Dato inválido. Escribí tu nombre.");
    return;
  }

  usuarioActual = nombre;
  guardarEnStorage(STORAGE_KEYS.USUARIO, usuarioActual);

  inputUsuario.value = "";
  renderUsuario();
  setMensaje(msgUsuario, "Usuario guardado.");
});

document.addEventListener("click", function (e) {
  const target = e.target;

  if (target.matches("button[data-action]")) {
    const action = target.getAttribute("data-action");
    ejecutarAccion(action);
  }
});

formInscripcion.addEventListener("submit", function (e) {
  e.preventDefault();

  const idClase = parseInt(selectClase.value);
  inscribirUsuarioEnClase(idClase);
});

renderUsuario();
renderSelectClases();
renderClasesEnSalida();
