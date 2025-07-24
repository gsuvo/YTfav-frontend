console.log('API_URL en build:', process.env.API_URL);
const fs = require('fs');
const path = require('path');

const envProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const content = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || ''}',
  YOUTUBE_API_KEY: '${process.env.YOUTUBE_API_KEY || ''}',
  RECAPTCHA_SITE_KEY: '${process.env.RECAPTCHA_SITE_KEY || ''}'
};
`;

fs.writeFileSync(envProdPath, content);
console.log('✔️  environment.prod.ts generado correctamente');
