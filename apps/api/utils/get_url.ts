import env from '#start/env'
export function getUrl(route: string) {
  return `${env.get('NODE_ENV') === 'development' ? 'http' : 'https'}://${env.get('HOST')}:${env.get('PORT')}/api/${route}`
}
