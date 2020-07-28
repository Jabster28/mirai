import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }]
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Search.vue') }]
  },
  {
    path: '/search/:query',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Search.vue') }]
  },
  {
    path: '/anime/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Anime.vue') }]
  },
  {
    path: '/user/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/User.vue') }]
  },
  {
    path: '/me',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Me.vue') }]
  },
  {
    path: '/setusr',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SetUsername.vue') }]
  },
  {
    path: '/setusr/:redirect',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SetUsername.vue') }]
  },
  {
    path: '/faq',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/FAQ.vue') }]
  },
  {
    path: '/searchusr',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SearchUsername.vue') }
    ]
  },
  {
    path: '/manga/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Manga.vue') }]
  },
  {
    path: '/searchmanga',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SearchManga.vue') }]
  },
  {
    path: '/searchmanga/:query',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SearchManga.vue') }]
  },
  {
    path: '/changelog',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Changelog.vue') }]
  },
  {
    path: '/incidents',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Incidents.vue') }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
