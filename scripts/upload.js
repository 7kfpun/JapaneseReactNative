const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const md5 = require('md5');
const queryString = require('querystring');

const { config } = require('../app/config');

const PROJECT_ID = 316516;
const FILE_NAME = './app/utils/locales/en/app.json';

const PUBLIC_KEY = config.oneskyApiKey;
const SECRET_KEY = config.oneskySecretKey;

function updateFile() {
  const timestamp = Date.now() / 1000;
  const devHash = md5(timestamp + SECRET_KEY);

  const url = `https://platform.api.onesky.io/1/projects/${PROJECT_ID}/files?${queryString.stringify(
    {
      timestamp,
      api_key: PUBLIC_KEY,
      dev_hash: devHash,
    }
  )}`;

  const form = new FormData();
  form.append('file', fs.createReadStream(FILE_NAME));
  form.append('file_format', 'HIERARCHICAL_JSON');
  form.append('locale', 'en');

  console.log(url);
  fetch(url, { method: 'POST', body: form })
    .then(res => res.json())
    .then(json => console.log(json));
}

updateFile();
