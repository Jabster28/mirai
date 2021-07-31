import { LocalStorage } from 'quasar';
export const getCache = (
  name: string,
  local: LocalStorage,
  checka: unknown,
  checkb: () => unknown,
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
export type Anime = {
  title: string;
  mal_id: string;
  rated: string;
  image_url: string;
  url: string;
  name?: string;
  trailer_url: string;
  type: string;
  title_english: string;
  synopsis: string;
  score: number;
  members: number;
  favorites: number;
  rank: number;
  watching_status: number;
};
export type User = {
  url: string;
  about: string;
  username: string;
  image_url?: string;
  anime_stats: { episodes_watched: number; days_watched: number };
};
export type Review = {
  content: string;
  reviewer: {
    username: string;
    scores: {
      overall: number;
    };
  };
  helpful_count: number;
};
