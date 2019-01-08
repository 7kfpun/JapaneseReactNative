const fetch = require('node-fetch');
const fs = require('fs');
const md5 = require('md5');
const queryString = require('querystring');

const { config } = require('../app/config');

const PROJECT_ID = 316516;
const FILE_NAME = 'app.json';
const OUTPUT_LOCATION = './app/utils/locales/';
const LOCALES = ['en', 'zh', 'zh-Hant', 'de', 'vi', 'my', 'fr'];

const PUBLIC_KEY = config.oneskyApiKey;
const SECRET_KEY = config.oneskySecretKey;

async function downloadFile(locale) {
  const timestamp = Date.now() / 1000;
  const devHash = md5(timestamp + SECRET_KEY);
  const url = `https://platform.api.onesky.io/1/projects/${PROJECT_ID}/translations?${queryString.stringify(
    {
      timestamp,
      locale,
      api_key: PUBLIC_KEY,
      dev_hash: devHash,
      source_file_name: FILE_NAME,
    }
  )}`;

  const body = await fetch(url);
  const text = await body.text();
  fs.writeFile(`${OUTPUT_LOCATION}/${locale}/app.json`, text, 'utf8', err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Download:', locale);
    }
  });
}

LOCALES.forEach(lang => downloadFile(lang));
