const clases = [
  { id: 1, nombre: "CrossFit", cupo: 3 },
  { id: 2, nombre: "Funcional", cupo: 2 },
  { id: 3, nombre: "Spinning", cupo: 1 }
];

let inscripciones = [];

function pedirDato(mensaje) {
  let dato = prompt(mensaje);

  while (dato === "" || dato === null) {
    dato = prompt("Dato inválido.\n" + mensaje);
  }

  return dato;
}

function mostrarClases(listaClases) {
  let texto = "CLASES DISPONIBLES:\n\n";

  for (let i = 0; i < listaClases.length; i++) {
    texto +=
      listaClases[i].id +
      ") " +
      listaClases[i].nombre +
      " | Cupo: " +
      listaClases[i].cupo +
      "\n";
  }

  alert(texto);
  console.log(texto);
}

function buscarClase(listaClases, idBuscado) {
  for (let i = 0; i < listaClases.length; i++) {
    if (listaClases[i].id === idBuscado) {
      return listaClases[i];
    }
  }
  return null;
}

function inscribir(persona, claseElegida, listaInscripciones) {

  if (claseElegida === null) {
    alert("No existe una clase con ese ID.");
    return;
  }

  if (claseElegida.cupo <= 0) {
    alert("No hay cupo disponible para " + claseElegida.nombre + ".");
    return;
  }

  listaInscripciones.push({
    persona: persona,
    clase: claseElegida.nombre
  });

  claseElegida.cupo = claseElegida.cupo - 1;

  alert("¡Listo! " + persona + " se anotó en " + claseElegida.nombre + ".");
  console.log("Inscripciones:", listaInscripciones);
}

function verMisInscripciones(persona, listaInscripciones) {
  let texto = "INSCRIPCIONES DE " + persona + ":\n\n";
  let tiene = false;

  for (let i = 0; i < listaInscripciones.length; i++) {
    if (listaInscripciones[i].persona === persona) {
      texto += "- " + listaInscripciones[i].clase + "\n";
      tiene = true;
    }
  }

  if (tiene === false) {
    alert("Todavía no tenés inscripciones.");
  } else {
    alert(texto);
    console.log(texto);
  }
}

alert("Bienvenido a MyGymBro (simulador básico)");

let nombreUsuario = pedirDato("Ingresá tu nombre:");

let opcion = parseInt(
  prompt(
    "MENÚ\n\n" +
      "1) Ver clases\n" +
      "2) Anotarme a una clase\n" +
      "3) Ver mis inscripciones\n" +
      "4) Salir\n\n" +
      "Elegí una opción (1-4):"
  )
);

while (opcion !== 4) {
  if (opcion === 1) {
    mostrarClases(clases);

  } else if (opcion === 2) {
    mostrarClases(clases);

    let idElegido = parseInt(pedirDato("Ingresá el ID de la clase a la que querés anotarte:"));
    let claseEncontrada = buscarClase(clases, idElegido);

    inscribir(nombreUsuario, claseEncontrada, inscripciones);

  } else if (opcion === 3) {
    verMisInscripciones(nombreUsuario, inscripciones);

  } else {
    alert("Opción inválida. Elegí 1, 2, 3 o 4.");
  }

  opcion = parseInt(
    prompt(
      "MENÚ\n\n" +
        "1) Ver clases\n" +
        "2) Anotarme a una clase\n" +
        "3) Ver mis inscripciones\n" +
        "4) Salir\n\n" +
        "Elegí una opción (1-4):"
    )
  );
}

alert("Gracias por usar MyGymBro.");
console.log("Fin del simulador");