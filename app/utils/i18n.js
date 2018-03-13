import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    app: require('./locales/en/app'),
  },
  zh: {
    app: require('./locales/zh/app'),
  },
};

I18n.translations['zh-Hans-US'] = I18n.translations.zh;
I18n.translations['zh-Hans-HK'] = I18n.translations.zh;
I18n.translations['zh-Hans-MN'] = I18n.translations.zh;
I18n.translations['zh-Hant-US'] = I18n.translations.zh;
I18n.translations['zh-Hant-HK'] = I18n.translations.zh;
I18n.translations['zh-Hant-MN'] = I18n.translations.zh;

console.log('I18n.locale', I18n.locale);

I18n.isZh = I18n.locale.startsWith('zh');

export default I18n;
