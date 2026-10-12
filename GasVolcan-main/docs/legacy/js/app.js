function renderCatalog() {
    const container = document.getElementById('product-list');
    if (!container) return;

    const productos = JSON.parse(localStorage.getItem('products')) || [];

    container.innerHTML = productos.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" style="width:120px; height:auto;">
            <h3>${p.name}</h3>
            <p>$${p.price.toLocaleString('es-CL')} | <strong>Stock: ${p.stock}</strong></p>
            <input type="number" id="cant-${p.id}" value="1" min="1" max="${p.stock}" style="width:50px;">
            <button class="btn" onclick="agregarAlCarrito('${p.id}')" ${p.stock === 0 ? 'disabled' : ''}>
                ${p.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </button>
        </div>
    `).join('');
}

function agregarAlCarrito(id) {
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    const inputCantidad = document.getElementById(`cant-${id}`);
    const cantidadDeseada = parseInt(inputCantidad?.value) || 1;
    const enCarrito = carrito.filter(item => item === id).length;

    if (enCarrito + cantidadDeseada > prod.stock) {
        alert(`No puedes agregar más. El límite en stock es de ${prod.stock} unidades.`);
        return;
    }

    for (let i = 0; i < cantidadDeseada; i++) {
        carrito.push(id);
    }

    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarCarrito();
}

function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const prod = (JSON.parse(localStorage.getItem('products')) || []).find(p => p.id === id);
    if (!prod) return;

    if (cambio === 1) {
        const enCarrito = carrito.filter(item => item === id).length;
        if (enCarrito + 1 > prod.stock) {
            alert(`Alcanzaste el tope máximo de stock (${prod.stock})`);
            return;
        }
        carrito.push(id);
    } else {
        const index = carrito.indexOf(id);
        if (index !== -1) carrito.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarCarrito();
}

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    carrito = carrito.filter(item => item !== id);
    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const productos = JSON.parse(localStorage.getItem('products')) || [];
    const tabla = document.getElementById('cart-items-body');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    if (countEl) countEl.innerText = carrito.length;
    if (!tabla) return;

    const resumen = {};
    carrito.forEach(id => resumen[id] = (resumen[id] || 0) + 1);

    let total = 0;
    tabla.innerHTML = Object.keys(resumen).map(id => {
        const p = productos.find(item => item.id === id);
        if (!p) return '';
        const cant = resumen[id];
        const subtotal = p.price * cant;
        total += subtotal;

        return `
            <tr>
                <td>${p.name}</td>
                <td>$${p.price.toLocaleString('es-CL')}</td>
                <td>
                    <button onclick="modificarCantidad('${id}', -1)">-</button>
                    ${cant}
                    <button onclick="modificarCantidad('${id}', 1)">+</button>
                </td>
                <td>$${subtotal.toLocaleString('es-CL')}</td>
                <td><button onclick="eliminarDelCarrito('${id}')">Quitar</button></td>
            </tr>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total.toLocaleString('es-CL');
}

function updateCartCount() {
    actualizarCarrito();
}

function cargarComunas() {
    const selectComuna = document.getElementById('reg-comuna');
    if (!selectComuna) return;

    const comunas = ['Macul', 'Santiago', 'Providencia', 'La Florida', 'Peñalolén'];
    selectComuna.innerHTML = '<option value="">Seleccione Comuna</option>';
    comunas.forEach(c => {
        selectComuna.innerHTML += `<option value="${c}">${c}</option>`;
    });
}

function initRegisterValidation() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let usuarios = JSON.parse(localStorage.getItem('users')) || [];
        const idEdit = document.getElementById('edit-id')?.value;
        const rut = document.getElementById('reg-rut').value;
        const nombre = document.getElementById('reg-nombre').value;
        const email = document.getElementById('reg-email').value;

        if (!validarRut(rut)) {
            alert('RUN inválido. Verifique el formato.');
            return;
        }
        if (!validarCorreo(email)) {
            alert('Correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }

        if (idEdit) {
            usuarios = usuarios.map(u => String(u.id) === String(idEdit) ? { id: u.id, rut, nombre, email } : u);
            alert('Usuario actualizado con éxito');
        } else {
            usuarios.push({ id: Date.now(), rut, nombre, email });
            alert('Registro exitoso.');
        }

        localStorage.setItem('users', JSON.stringify(usuarios));
        form.reset();
        if (document.getElementById('edit-id')) document.getElementById('edit-id').value = '';
        if (document.getElementById('btn-guardar-user')) document.getElementById('btn-guardar-user').innerText = 'Crear Usuario';
        renderUsuariosAdmin();
    });
}

function initContactValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensaje enviado con éxito. Nos pondremos en contacto pronto.');
        form.reset();
    });
}

function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
    });
}

function renderAdminTable() {
    const tbody = document.getElementById('admin-product-list');
    if (!tbody) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];

    tbody.innerHTML = products.map(p => {
        const isCritical = p.stock <= p.stockCritico;
        return `
            <tr class="${isCritical ? 'stock-critical' : ''}">
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>$${p.price.toLocaleString('es-CL')}</td>
                <td>${p.stock}</td>
                <td>${isCritical ? '⚠️ CRÍTICO' : 'OK'}</td>
            </tr>
        `;
    }).join('');
}

function updateStock(productId, newStock) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.map(p => p.id === productId ? { ...p, stock: newStock } : p);
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminTable();
}

function renderUsuariosAdmin() {
    const tabla = document.getElementById('admin-user-list');
    if (!tabla) return;

    const usuarios = JSON.parse(localStorage.getItem('users')) || [];
    tabla.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.rut}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>
                <button onclick="cargarUsuarioForm('${u.id}')">Editar</button>
                <button onclick="eliminarUsuario('${u.id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function eliminarUsuario(id) {
    let usuarios = JSON.parse(localStorage.getItem('users')) || [];
    usuarios = usuarios.filter(u => String(u.id) !== String(id));
    localStorage.setItem('users', JSON.stringify(usuarios));
    renderUsuariosAdmin();
}

function cargarUsuarioForm(id) {
    const usuarios = JSON.parse(localStorage.getItem('users')) || [];
    const u = usuarios.find(user => String(user.id) === String(id));
    if (!u) return;

    document.getElementById('edit-id').value = u.id;
    document.getElementById('reg-rut').value = u.rut;
    document.getElementById('reg-nombre').value = u.nombre;
    document.getElementById('reg-email').value = u.email;
    document.getElementById('btn-guardar-user').innerText = 'Actualizar Usuario';
}

function checkRoleAccess(userRole) {
    const adminNav = document.getElementById('nav-admin');
    if (adminNav && userRole !== 'Admin') {
        adminNav.classList.add('hidden');
    }
}

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
        { id: 1, rut: '12345678-K', nombre: 'Admin Sistema', email: 'admin@duoc.cl' }
    ]));
}

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    renderAdminTable();
    renderUsuariosAdmin();
    actualizarCarrito();
    cargarComunas();
    initRegisterValidation();
    initContactValidation();
    initLogin();
});

console.log('GasVolcan App iniciada correctamente.');
