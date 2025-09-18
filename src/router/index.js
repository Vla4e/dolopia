//index.js router
import { createRouter, createWebHistory } from 'vue-router';
import { handleProjectRouteParameters } from './routeParameterHandler';
import { isRouteLoading, preloadRouteComponents } from './routePreloader';


/*
floating - doesn't take up viewport space
pinned - stays on top of page, doesn't take up viewport space
otherwise - stays on top, takes up viewport space (pushes down components)
*/
const DEFAULT_NAVBAR_META = {
  navbar: {
    desktop: {
      show: false,
      floating: false,
      pinned: false,
      blur: false,
      theme: 'dark'
    },
    mobile: {
      show: false,
      floating: false,
      pinned: false,
      blur: false,
      theme: 'dark'
    }
  },

  footer: {
    desktop: {
      show: true,
      floating: true,
      pinned: false,
    },
    mobile: {
      show: true,
      floating: true,
      pinned: false,
    }
  },

  showRouterArrow: false,
};

// merge default and override it with params
const deepMerge = (target, source) => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
};

const createRouteMeta = (overrides = {}) => deepMerge(DEFAULT_NAVBAR_META, overrides);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: true,
            floating: true,
            pinned: false,
            blur: true,
            theme: 'dark'
          },
          mobile: {
            show: true,
            floating: true,
            pinned: true,
            blur: false,
            theme: 'dark' // DO THIS DIFFERENTLYYYYYYYYY
          }
        },
        footer: {
          desktop: {
            show: true,
            floating: true,
            pinned: false
          },
          mobile: {
            show: false,
            floating: false,
            pinned: false
          }
        },
        showRouterArrow: true
      })
    },

    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/ProjectsView.vue'),
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: false,
            floating: false,
            pinned: false,
            blur: true
          },
          mobile: {
            show: true,
            floating: true,
            pinned: false,
            blur: false
          }
        },
        footer: {
          desktop: {
            show: false,
            floating: false,
          },
          mobile: {
            show: false,
            floating: false,
          }
        }
      })
    },

    {
      // Alias for /catalog page
      path: '/projects',
      name: 'projects-overview',
      component: () => import('../views/ProjectsView.vue'),
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: false,
            floating: true,
            pinned: false,
            blur: false
          },
          mobile: {
            show: true,
            floating: false,
            pinned: false,
            blur: true
          }
        },
        footer: {
          desktop: {
            show: false,
            floating: false,
          },
          mobile: {
            show: false,
            floating: false,
          }
        }
      })
    },

    {
      // Leads to AllProductsView with defaulted tomato-project
      path: '/all-products', 
      name: 'all-products',
      component: () => import('../views/AllProductsView.vue'),
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: true,
            floating: true,
            pinned: false,
          },
          mobile: {
            show: true,
            floating: true,
            pinned: false,
            theme: "light"
          }
        },
        footer: {
          desktop: {
            show: true,
            floating: false,
          },
          mobile: {
            show: true,
            floating: false,
          }
        },
      })
    },

    {
      // Leads to all products view with preselected project (:category)
      path: '/projects/:category',
      name: 'category-overview',
      component: () => import('../views/AllProductsView.vue'),
      props: true,
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: true,
            floating: true,
            pinned: false,
          },
          mobile: {
            show: true,
            floating: true,
            pinned: false,
            theme: "light"
          }
        },
      })
    },

    {
      // Leads to all products view with preselected project and subcategory
      path: '/projects/:category/:subcategory',
      name: 'subcategory-overview',
      component: () => import('../views/AllProductsView.vue'),
      props: true,
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: true,
            floating: true,
            pinned: false,
          },
          mobile: {
            show: true,
            floating: true,
            pinned: false,
            theme: "light"
          }
        },
      })
    },

    {
      // Route for individual product details
      path: '/projects/:category/:subcategory/:product',
      name: 'projects',
      component: () => import('../views/ProductView.vue'),
      props: (route) => ({
        category: route.params.category,
        subcategory: route.params.subcategory,
        product: route.params.product,
      }),
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: true,
            floating: true,
            pinned: false,
          },
          mobile: {
            show: true,
            floating: true,
            pinned: false,
          }
        },
      })
    },

    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: true,
            floating: true,
            pinned: false,
          },
          mobile: {
            show: false,
            floating: true,
            pinned: false,
          }
        },
        footer: {
          desktop: {
            show: false,
            floating: true,
          },
          mobile: {
            show: false,
            floating: true,
          }
        }
      })
    },

    {
      path: '/awards',
      name: 'awards',
      component: () => import('../views/AwardsView.vue'),
      meta: createRouteMeta({
        navbar: {
          desktop: {
            show: true,
            floating: true,
            pinned: false,
          },
          mobile: {
            show: true,
            floating: true,
            pinned: false,
          }
        }
      })
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
    }
  ],

  // scrollBehavior(to, from, savedPosition) {
  //   // If the user is routing back/forward, restore the previous scroll position
  //   if (savedPosition) {
  //     return savedPosition;
  //   }
  //   // For all other navigation, scroll to the top of the page.
  //   else {
  //     return { top: 0 };
  //   }
  // }
});


router.beforeEach(async (to, from, next) => {
  try {
    await preloadRouteComponents(to);
    if (to.name === 'projects') {
      const resolution = await handleProjectRouteParameters(to.params)
      switch (resolution.status) {
        case 'VALID':
          next();
          break;
        case 'REDIRECT':
          next(resolution.payload);
          break;
        case 'NOT_FOUND':
        default:
          next({ name: 'home' });
          break;
      }
    } else {
      next();
    }
  } catch (e) {
    console.error("Failed during routing:", e);
    next({ name: 'home' });
  }
});

export default router;