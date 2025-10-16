// Control de visibilidad de secciones y menú activo
function mostrarSeccion(id, link) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(sec => sec.classList.remove('seccion-activa'));

    document.getElementById(id).classList.add('seccion-activa');

    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    // Opcional: cerrar carrito al cambiar sección
    document.getElementById('carrito').classList.remove('mostrar');
}

// Cargar carrito desde localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const contadorCarrito = document.getElementById('contador-carrito');

actualizarContador();
mostrarCarrito();

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agrega producto (con cantidad)
function agregarAlCarrito(nombre, precio) {
    const index = carrito.findIndex(item => item.nombre === nombre);
    if (index !== -1) {
        carrito[index].cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizarContador();
    guardarCarrito();
    alert(`${nombre} agregado al carrito`);
}

// Actualiza contador visible en carrito
function actualizarContador() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
}

// Mostrar / Ocultar carrito con animación usando clase 'mostrar'
function toggleCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.classList.toggle('mostrar');
    mostrarCarrito();
}

// Muestra los productos del carrito con cantidades y botones eliminar/menos/mas
function mostrarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const total = document.getElementById('total-carrito');
    lista.innerHTML = '';
    let suma = 0;

    carrito.forEach((item, index) => {
        const li = document.createElement('li');

        const nombreSpan = document.createElement('span');
        nombreSpan.textContent = `${item.nombre} (x${item.cantidad}) - S/. ${(item.precio * item.cantidad).toFixed(2)}`;

        // Botón para disminuir cantidad
        const btnMenos = document.createElement('button');
        btnMenos.textContent = '-';
        btnMenos.title = 'Disminuir cantidad';
        btnMenos.onclick = () => {
            if (item.cantidad > 1) {
                item.cantidad--;
            } else {
                carrito.splice(index, 1);
            }
            actualizarContador();
            guardarCarrito();
            mostrarCarrito();
        };

        // Botón para aumentar cantidad
        const btnMas = document.createElement('button');
        btnMas.textContent = '+';
        btnMas.title = 'Aumentar cantidad';
        btnMas.onclick = () => {
            item.cantidad++;
            actualizarContador();
            guardarCarrito();
            mostrarCarrito();
        };

        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'X';
        btnEliminar.title = 'Eliminar producto';
        btnEliminar.onclick = () => {
            carrito.splice(index, 1);
            actualizarContador();
            guardarCarrito();
            mostrarCarrito();
        };

        li.appendChild(nombreSpan);
        li.appendChild(btnMenos);
        li.appendChild(btnMas);
        li.appendChild(btnEliminar);

        lista.appendChild(li);

        suma += item.precio * item.cantidad;
    });

    total.textContent = `Total: S/. ${suma.toFixed(2)}`;
}

// Vaciar carrito completo
function vaciarCarrito() {
    if (confirm("¿Estás seguro que quieres vaciar el carrito?")) {
        carrito.length = 0;
        actualizarContador();
        guardarCarrito();
        mostrarCarrito();
    }
}

// Enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviar el pedido.");
        return;
    }

    let mensaje = "Hola, quiero hacer el siguiente pedido:\n";
    carrito.forEach((item, index) => {
        mensaje += `${index + 1}. ${item.nombre} (x${item.cantidad}) - S/. ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    mensaje += `Total: S/. ${total.toFixed(2)}\n`;
    mensaje += "Por favor, contáctame para concretar la compra.";

    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = "51977495812";
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`, '_blank');
}
