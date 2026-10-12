import { expect, test } from '@playwright/test'

test('la portada carga con el título correcto', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveTitle(/GasVolcan/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tu carga de gas a un click')
})

test('el menú navega entre páginas usando HashRouter', async ({ page }) => {
  await page.goto('./')
  const menu = page.getByRole('navigation', { name: 'Principal' })

  await menu.getByRole('link', { name: /Catálogo/ }).click()
  await expect(page).toHaveURL(/#\/catalogo$/)
  await expect(page.getByRole('heading', { name: 'Catálogo de productos' })).toBeVisible()

  await menu.getByRole('link', { name: 'Contacto/Registro' }).click()
  await expect(page).toHaveURL(/#\/contacto$/)
  // Las regiones vienen de public/data/regiones.json: comprueba que la ruta relativa funciona en el build.
  await expect(page.getByRole('option', { name: 'Región Metropolitana' })).toBeAttached()

  await menu.getByRole('link', { name: 'Iniciar sesión' }).click()
  await expect(page).toHaveURL(/#\/login$/)

  await menu.getByRole('link', { name: 'Inicio' }).click()
  await expect(page).toHaveURL(/#\/$/)
})

test('una ruta inexistente muestra 404', async ({ page }) => {
  await page.goto('./#/esta-ruta-no-existe')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})
