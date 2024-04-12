import env from '#infrastructure/adonis/env'
export function getUrl(route: string) {
  return `${env.get('NODE_ENV') === 'development' ? 'http' : 'https'}://${env.get('HOST')}:${env.get('PORT')}${route}`
}
