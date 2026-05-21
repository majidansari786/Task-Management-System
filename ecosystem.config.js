module.exports = {
  apps: [
    {
      name: 'internshala-backend',
      script: './app.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    },
    {
      name: 'internshala-frontend',
      script: 'serve',
      cwd: './frontend',
      args: '-s build -l 80',
      instances: 1,
      exec_mode: 'cluster',
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log'
    }
  ]
};
