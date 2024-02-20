module.exports = {
    packageManager: 'pnpm',
    reporters: ['html', 'clear-text', 'progress'],
    commandRunner: { command: 'pnpm run test' },
    coverageAnalysis: 'all',
    tsconfigFile: 'tsconfig.json',
    mutate: ['app/**/*.ts'],
}
