// Regiones y comunas se cargan desde public/data/regiones.json con useFetch.
// import.meta.env.BASE_URL vale './' en producción (ver vite.config.js).
export const REGIONES_URL = `${import.meta.env.BASE_URL}data/regiones.json`

export function comunasDeRegion(regiones, codigo) {
  return regiones?.find((r) => r.codigo === codigo)?.comunas ?? []
}
