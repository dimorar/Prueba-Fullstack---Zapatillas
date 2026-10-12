function validarRut(rut) {
    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) return false;
    const body = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    let suma = 0, multiplicador = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        suma += parseInt(body.charAt(i)) * multiplicador;
        multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
    let dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 11) dvEsperado = '0';
    if (dvEsperado === 10) dvEsperado = 'K';
    return dv.toString() === dvEsperado.toString();
}
function validarCorreo(email) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => email.endsWith(dominio));
}
