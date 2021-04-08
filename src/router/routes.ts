import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Search.vue') }],
  },
  {
    path: '/search/:query',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Search.vue') }],
  },
  {
    path: '/anime/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Anime.vue') }],
  },
  {
    path: '/user/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/User.vue') }],
  },
  {
    path: '/me',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Me.vue') }],
  },
  {
    path: '/faq',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/FAQ.vue') }],
  },
  {
    path: '/searchusr',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SearchUsername.vue') },
    ],
  },
  {
    path: '/manga/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Manga.vue') }],
  },
  {
    path: '/searchmanga',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SearchManga.vue') }],
  },
  {
    path: '/searchmanga/:query',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SearchManga.vue') }],
  },
  {
    path: '/oauth',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Oauth.vue') }],
  },
  {
    path: '/oauth/:redirect',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Oauth.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
  },
  {
    path: '/logout',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Logout.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
