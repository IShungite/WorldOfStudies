import ky from 'ky'

const kyInstance = ky.create({
  prefixUrl: `${process.env.EXPO_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
})
export default kyInstance
