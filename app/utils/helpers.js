export const shuffle = (a) => {
  let j;
  let x;
  let i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

export const cleanWord = text => text
  .replace(/（.*?）/g, '')
  .replace(/［.*?］/g, '')
  .replace(/「.*?」/g, '')
  .replace(/\[.*\]/g, '')
  .replace(/～/g, '')
  .replace(/。/g, '');

export const range = (start, stop, step = 1) =>
  Array((stop - start) / step)
    .fill(start)
    .map((x, y) => x + (y * step));
