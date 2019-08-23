<script lang="ts">
import { Line, mixins } from 'vue-chartjs';
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

const { reactiveProp } = mixins;

@Component
export default class Chart extends Mixins(Line, reactiveProp) {
  @Prop() private chartData!: {
    datasets: [{ data: number[] }];
  };
  @Prop() private width!: number;

  @Prop() private height!: number;
  @Prop(Object) private options: any;

  @Watch('options')
  public watchOptions(current: any, prev: any) {
    if (JSON.stringify(current) !== JSON.stringify(prev)) {
      this.renderChart(this.chartData, this.options);
    }
  }

  public mounted() {
    if (this.width) {
      (this.$refs.canvas as HTMLCanvasElement).width = this.width;
    }
    if (this.height) {
      (this.$refs.canvas as HTMLCanvasElement).height = this.height;
    }
    this.renderChart(this.chartData, this.options);
  }
}
</script>

<style scoped></style>
