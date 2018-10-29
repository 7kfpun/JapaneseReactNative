const fetch = require('node-fetch');
const fs = require('fs');
const md5 = require('md5');
const queryString = require('querystring');

const { config } = require('../app/config');

const PROJECT_IDS = [
  {
    id: 320297,
    name: 1,
  },
  {
    id: 320310,
    name: 2,
  },
  {
    id: 320311,
    name: 3,
  },
  {
    id: 320312,
    name: 4,
  },
  {
    id: 320313,
    name: 5,
  },
  {
    id: 320314,
    name: 6,
  },
  {
    id: 320315,
    name: 7,
  },
  {
    id: 320316,
    name: 8,
  },
  {
    id: 320317,
    name: 9,
  },
  {
    id: 320318,
    name: 10,
  },
  {
    id: 320319,
    name: 11,
  },
  {
    id: 320320,
    name: 12,
  },
  {
    id: 320656,
    name: 13,
  },
  {
    id: 320657,
    name: 14,
  },
  {
    id: 320658,
    name: 15,
  },
  {
    id: 320659,
    name: 16,
  },
  {
    id: 320660,
    name: 17,
  },
  {
    id: 320661,
    name: 18,
  },
  {
    id: 320662,
    name: 19,
  },
  {
    id: 320663,
    name: 20,
  },
  {
    id: 320664,
    name: 21,
  },
  {
    id: 320665,
    name: 22,
  },
  {
    id: 320666,
    name: 23,
  },
  {
    id: 320667,
    name: 24,
  },
  {
    id: 320668,
    name: 25,
  },
  {
    id: 320669,
    name: 26,
  },
  {
    id: 320670,
    name: 27,
  },
  {
    id: 320671,
    name: 28,
  },
  {
    id: 320672,
    name: 29,
  },
  {
    id: 320673,
    name: 30,
  },
  {
    id: 320674,
    name: 31,
  },
  {
    id: 320675,
    name: 32,
  },
];

const OUTPUT_LOCATION = './app/utils/minna/';
const LOCALES = ['de'];

const PUBLIC_KEY = config.oneskyApiKey;
const SECRET_KEY = config.oneskySecretKey;

async function downloadFile(locale, lesson) {
  const timestamp = Date.now() / 1000;
  const devHash = md5(timestamp + SECRET_KEY);
  const url = `https://platform.api.onesky.io/1/projects/${
    lesson.id
  }/translations?${queryString.stringify({
    timestamp,
    locale,
    api_key: PUBLIC_KEY,
    dev_hash: devHash,
    source_file_name: `${lesson.name}.json`,
  })}`;

  const body = await fetch(url);
  const text = await body.text();
  fs.writeFile(
    `${OUTPUT_LOCATION}/${locale}/${lesson.name}.json`,
    text,
    'utf8',
    () => console.log('Download:', locale, lesson.name)
  );
}

PROJECT_IDS.forEach(lesson =>
  LOCALES.forEach(lang => downloadFile(lang, lesson))
);
