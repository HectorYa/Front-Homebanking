import hbApi from './hb_api.js'

export async function getReclamos() {
  const { data } = await hbApi.get('/reclamos/')
  return data
}

export async function crearReclamo({ asunto, descripcion, tipo }) {
  const { data } = await hbApi.post('/reclamos/', { asunto, descripcion, tipo })
  return data
}
