module.exports = {
  apps: [
    {
      name: 'winterra-exercise-api',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}; 