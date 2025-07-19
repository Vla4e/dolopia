import router from '@/router/index.js';

export function goToRoute(route, replace = false) {
  try {
    if (replace) {
      router.replace(route);
    } else {
      router.push(route); 
    }
  } catch (error) {
    console.error('Failed to navigate:', error);
    router.push({ name: 'home' });
  }
}
