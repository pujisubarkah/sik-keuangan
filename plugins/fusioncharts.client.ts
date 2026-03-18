import VueFusionCharts from 'vue-fusioncharts'
import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'

export default defineNuxtPlugin((nuxtApp) => {
  Charts(FusionCharts)
  nuxtApp.vueApp.use(VueFusionCharts, FusionCharts, FusionTheme)
})