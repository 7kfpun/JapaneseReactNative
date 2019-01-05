// TODO: refactor
import { flatten } from './helpers';
import { items } from './items';
import I18n from './i18n';

export const vocabs = flatten(
  Object.keys(items).map(key =>
    items[key].data.map(i => ({
      lesson: key,
      translation: I18n.t(`minna.${key}.${i.romaji}`),
      ...i,
    }))
  )
);

export const vocabsMapper = vocabs.reduce((obj, item) => {
  obj[item.romaji] = item;
  return obj;
}, {});
