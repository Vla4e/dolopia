// router/routePreloader.js
import { ref } from 'vue';

export const isRouteLoading = ref(false);

/**
 * Preloads async components for a given route.
 * @param {import('vue-router').RouteLocationNormalized} to - Target route object.
 * @returns {Promise<void>} Resolves when all async components are loaded.
 */

export async function preloadRouteComponents(to) {
  const matchedComponents = to.matched.flatMap(record =>
    Object.values(record.components || {})
  );

   // Filter for components that are functions (being a function indicates lazy loading)
  const asyncComponentsToPreload = matchedComponents.filter(
    component => typeof component === 'function'
  );

  // will be > 0 if there exist Async routes (using vite's async import of component in route definitions /router/index.js)
  if (asyncComponentsToPreload.length > 0) {
    try {
      isRouteLoading.value = true;
      // Execute all dynamic import() functions for the matched async components
      await Promise.all(asyncComponentsToPreload.map(loader => loader()));
    } catch (e) {
      console.error("Failed to preload route components:", e);
    } finally {
      isRouteLoading.value = false;
    }
  }
}