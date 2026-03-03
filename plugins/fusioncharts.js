import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueFusionCharts, FusionCharts, FusionTheme);
});
