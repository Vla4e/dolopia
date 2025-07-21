import { createRouter, createWebHistory } from 'vue-router';
import { handleProjectRouteParameters } from './routeParameterHandler';
import { isRouteLoading, preloadRouteComponents } from './routePreloader';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: false,
        floatingNavbar: true,
        floatingFooter: false,
        fullWidthPage: false,
        showRouterArrow: true
      }
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/ProjectsView.vue'),
      meta: { 
        hasNavbar: false,
        hasFooter: false,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: false,
        floatingFooter: false,
        fullWidthPage: true
      }
    },
    {
      // Leads to AllProductsView with defaulted tomato-project
      path: '/all-products', 
      name: 'all-products',
      component: () => import('../views/AllProductsView.vue'), // Remove the redirect, use a component instead
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: true
      }
    },
    {
      // Alias for /all-products page
      path: '/projects',
      name: 'projects-overview',
      component: () => import('../views/ProjectsView.vue'),
      meta: { 
        hasNavbar: false,
        hasFooter: false,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: false,
        floatingFooter: false,
        fullWidthPage: true
      }
    },
    {
      // Leads to all products view with preselected project (:category)
      path: '/projects/:category',
      name: 'category-overview',
      component: () => import('../views/AllProductsView.vue'),
      props: true,
      meta: {
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: true
      }
    },
    {
      // Leads to all products view with preselected project and subcategory
      path: '/projects/:category/:subcategory',
      name: 'subcategory-overview',
      component: () => import('../views/AllProductsView.vue'),
      props: true,
      meta: {
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: true
      }
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
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { 
        hasNavbar: false,
        hasFooter: false,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: false
      }
    },
    {
      path: '/awards',
      name: 'awards',
      component: () => import('../views/AwardsView.vue'),
      meta: { 
        hasNavbar: true,
        hasFooter: true,
        hasNavbarMobile: true,
        floatingNavbarMobile: true,
        floatingNavbar: true,
        floatingFooter: true,
        fullWidthPage: true,
        showRouterArrow: false,
        showDropdown: false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    // If the user is routing back/forward, restore the previous scroll position
    if (savedPosition) {
      return savedPosition;
    }
    // For all other navigation, scroll to the top of the page.
    else {
      return { top: 0 };
    }
  }
});

router.beforeEach(async (to, from, next) => {
  console.log("Router: TO ->", JSON.parse(JSON.stringify(to)));
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