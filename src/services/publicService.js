import hbApi from './hb_api.js'

export async function simularCredito({ monto, plazo, tea }) {
  const { data } = await hbApi.post('/public/simular', { monto, plazo, tea })
  return data
}

export async function getTarifarios() {
  const { data } = await hbApi.get('/public/tarifarios')
  return data
}
