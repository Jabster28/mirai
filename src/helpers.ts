export const getCache = (
  name: string,
  local: any,
  checka: any,
  checkb: () => any,
  notify: (arg0: string) => void,
  finish: () => void,
  cache = 'cache'
) => {
  console.log('checking for cached ' + name);
  let x = local.getItem(cache);
  if (!x) {
    local.set(cache, {});
    x = {};
  }
  /* @ts-ignore */
  if (!x[name]) x[name] = {};
  /* @ts-ignore */
  if (x[name][checkb()]) {
    if (checka != checkb()) return;

    /* @ts-ignore */
    console.log('found some');
    /* @ts-ignore */
    finish();
    return;
  } else {
    console.log('none found');
    if (checka != checkb()) return;

    notify(
      `This ${name} hasn't been cached, so we can't show you anything. Connect to the internet and try again.`
    );
    finish();
    return;
  }
};
