import env from '#infrastructure/adonis/env'
export function getFullUrl(route: string) {
  return `${env.get('NODE_ENV') === 'development' ? 'http' : 'https'}://${env.get('HOST')}:${env.get('PORT')}${route}`
}
