// Returns a new list containing elements from the population while leaving the original population unchanged.
export const shuffle = a => {
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

export const cleanWord = text =>
  text
    .replace(/（.*?）/g, '')
    .replace(/［.*?］/g, '')
    .replace(/「.*?」/g, '')
    .replace(/\[.*\]/g, '')
    .replace(/～/g, '')
    .replace(/。/g, '');

// Return a randomly selected element from range(start, stop, step).
export const range = (start, stop, step = 1) =>
  Array((stop - start) / step)
    .fill(start)
    .map((x, y) => x + y * step);

// Flatten a list of lists of elements into a list of elements.
export const flatten = arr =>
  arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Return a random element from the non-empty list.
export const choice = arr => arr[Math.floor(Math.random() * arr.length)];

// Return a random integer N such that 0 <= N <= max.
export const randomInt = max => Math.floor(Math.random() * Math.floor(max));

// No operation function.
export const noop = () => {};
