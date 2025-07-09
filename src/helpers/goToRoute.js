// src/helpers/goToRoute.js

import router from '@/router'; // Adjust the path if your router file is elsewhere

/**
 * Helper function to programmatically navigate to a route.
 * This function wraps router.push() for convenience.
 *
 * @param {string | object} route - The route to navigate to.
 * Can be a string (path) or an object (name, params, query).
 * Examples:
 * - '/catalog'
 * - { name: 'catalog' }
 * - { name: 'projects', params: { category: 'fruits', subcategory: 'apple', product: 'gala' } }
 * - { path: '/projects/fruits/apple/gala' }
 * @param {boolean} replace - If true, replaces the current entry in the history stack
 * instead of pushing a new one. Defaults to false (push).
 */
export function goToRoute(route, replace = false) {
  try {
    if (replace) {
      router.replace(route);
    } else {
      router.push(route);
    }
  } catch (error) {
    console.error('Failed to navigate:', error);
    // Optionally, handle navigation errors, e.g., redirect to a fallback page
    // router.push({ name: 'home' });
  }
}

/**
 * Helper function to programmatically navigate and replace the current route.
 * Useful for redirects or when you don't want to add to the browser history.
 *
 * @param {string | object} route - The route to navigate to.
 */
export function replaceRoute(route) {
  goToRoute(route, true);
}