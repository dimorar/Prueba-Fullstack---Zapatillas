import { expect, test } from '@playwright/test'

/** Inicia sesión desde /login (la página a la que redirigen las rutas protegidas). */
async function iniciarSesion(page, email, password) {
  await page.getByLabel('Correo').fill(email)
  await page.getByLabel('Contraseña').fill(password)
  await page.getByRole('button', { name: 'Ingresar' }).click()
}

test('agrega al carrito y el carrito sobrevive a una recarga', async ({ page }) => {
  await page.goto('./#/catalogo')
  const tarjeta = page.locator('article', { has: page.getByRole('heading', { name: 'Gas 15Kg' }) })
  await tarjeta.getByLabel('Cantidad de Gas 15Kg').fill('2')
  await tarjeta.getByRole('button', { name: 'Agregar al carrito' }).click()

  await expect(page.getByTestId('total')).toHaveText('Total a pagar: $43.000')
  await page.reload()
  await expect(page.getByTestId('total')).toHaveText('Total a pagar: $43.000')
  await expect(page.getByLabel('productos en el carrito')).toHaveText('2')
})

test('busca productos en el catálogo', async ({ page }) => {
  await page.goto('./#/catalogo')
  await page.getByRole('searchbox', { name: 'Buscar' }).fill('45')
  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Gas 45Kg' })).toBeVisible()
})

test('compra completa: registro, pedido y despacho por el administrador', async ({ page }) => {
  // 1. Registro de un cliente nuevo
  await page.goto('./#/contacto')
  const registro = page.getByRole('form', { name: 'Formulario: Registrarse' })
  await registro.getByLabel('RUN').fill('11.111.111-1')
  await registro.getByLabel('Nombre completo').fill('Ana Pérez')
  await registro.getByLabel('Correo').fill('ana@gmail.com')
  await registro.getByLabel('Contraseña').fill('secreto1')
  await registro.getByLabel('Región').selectOption('RM')
  await registro.getByLabel('Comuna').selectOption('Macul')
  await registro.getByRole('button', { name: 'Registrarse' }).click()
  await expect(page.getByText('Registro exitoso.')).toBeVisible()

  // 2. Agrega un cilindro y confirma el pedido (le pide iniciar sesión)
  await page.goto('./#/catalogo')
  const tarjeta = page.locator('article', { has: page.getByRole('heading', { name: 'Gas 11Kg' }) })
  await tarjeta.getByRole('button', { name: 'Agregar al carrito' }).click()
  await page.getByRole('link', { name: 'iniciar sesión', exact: true }).click()
  await iniciarSesion(page, 'ana@gmail.com', 'secreto1')
  await expect(page.getByText('Hola, Ana')).toBeVisible()

  await page.getByLabel('Dirección de despacho').fill('Los Olmos 123')
  await page.getByRole('button', { name: 'Confirmar pedido' }).click()
  await expect(page.getByText('Pedido P-0001 confirmado.')).toBeVisible()
  await page.getByRole('link', { name: 'Ver mis pedidos' }).click()
  await expect(page.getByRole('listitem', { name: 'Pedido P-0001' })).toContainText('Pendiente')

  // 3. El administrador lo despacha
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await page.goto('./#/admin')
  await iniciarSesion(page, 'admin@duoc.cl', 'admin123')
  await expect(page.getByRole('heading', { name: 'Panel de administración' })).toBeVisible()
  await page.getByLabel('Estado del pedido P-0001').selectOption('En reparto')
  await expect(page.getByText('Pedido P-0001 cambiado a "En reparto".')).toBeVisible()
})

test('el administrador ve el stock crítico', async ({ page }) => {
  await page.goto('./#/admin')
  await iniciarSesion(page, 'admin@duoc.cl', 'admin123')
  await expect(page.getByText('Hay 2 producto(s) con stock crítico.')).toBeVisible()
  await expect(page.locator('tr.stock-critical')).toHaveCount(2)
})

test('el registro rechaza un RUN inválido', async ({ page }) => {
  await page.goto('./#/contacto')
  const form = page.getByRole('form', { name: 'Formulario: Registrarse' })
  await form.getByLabel('RUN').fill('12345678-K')
  await form.getByRole('button', { name: 'Registrarse' }).click()
  await expect(form.getByText(/RUN inválido/)).toBeVisible()
})
