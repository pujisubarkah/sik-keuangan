export default defineNuxtPlugin((nuxtApp) => {
  // Hanya berjalan di client-side
  if (process.client) {
    const authFetch = $fetch.create({
      onRequest({ options }: { request?: any; options: any }) {
        // Ambil token dari localStorage saat request dibuat
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          options.headers = options.headers || {};
          options.headers['Authorization'] = `Bearer ${token}`;
          console.log('Auth-Fetch Plugin: Authorization header set:', options.headers['Authorization'])
        } else {
          console.log('Auth-Fetch Plugin: No token found in localStorage')
        }
      }
    });

    return {
      provide: {
        authFetch
      }
    };
  }
});
