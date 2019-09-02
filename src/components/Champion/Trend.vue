<template>
  <div>
    <div class="chart-title">
      <div class="subject">{{ title }}</div>
      <div class="value">
        <span>{{ trends[trends.length - 1] }}%</span>
        <span
          :class="
            changes > 0
              ? 'blue--text'
              : changes === 0
              ? 'gray--text'
              : 'red--text'
          "
          class="changes"
        >
          (
          <span v-show="changes !== 0">{{ changes }}%</span>
          <span v-if="changes > 0">▲</span>
          <span v-else-if="changes < 0">▼</span>
          <span v-else> - </span>
          )
        </span>
      </div>
    </div>
    <div class="d-inline-block">
      <line-chart
        :chartData="chartData"
        :height="height"
        :options="options"
        :width="width"
        v-if="chartData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { cuttingPoint } from '@/base/math';
import { Component, Prop, Vue } from 'vue-property-decorator';
import LineChart from '../UI/Chart/LineChart.vue';

@Component({
  components: { LineChart },
})
export default class Trend extends Vue {
  @Prop() private title!: string;
  @Prop() private chartData!: {
    datasets: [{ data: number[] }];
  };
  @Prop() private width!: number;
  @Prop() private height!: number;
  @Prop() private tooltipLabel?: string;
  @Prop(Boolean) private hideYTick?: boolean;

  public get trends() {
    if (this.chartData && this.chartData.datasets) {
      return this.chartData.datasets[0].data;
    } else {
      return [0];
    }
  }

  public get changes() {
    if (this.trends.length >= 2) {
      return cuttingPoint(
        this.trends[this.trends.length - 1] -
          this.trends[this.trends.length - 2],
        1
      );
    } else {
      return 0;
    }
  }

  public get options() {
    let diff = 0;
    if (this.trends) {
      diff = Math.max(...this.trends) - Math.min(...this.trends);
    }

    return {
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        displayColors: false,
        titleFontColor: '#CCC',
        titleFontSize: 10,
        bodyFontSize: 13,
        xPadding: 7,
        yPadding: 7,
        callbacks: {
          label: (tooltipItem: any) => {
            if (this.tooltipLabel) {
              return `${this.tooltipLabel} : ${tooltipItem.value}%`;
            } else {
              return `${tooltipItem.value}%`;
            }
          },
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              display: !this.hideYTick,
              suggestedMin: Math.min(...this.trends) - diff / 5,
              suggestedMax: Math.max(...this.trends) + diff / 5,
              stepSize: Math.floor((diff / 2) * 10) / 10,
              padding: 20,
              callback: function(value: number) {
                return value + '%';
              },
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
      },
    };
  }
}
</script>

<style lang="scss" scoped>
.chart-title {
  display: inline-block;
  width: 110px;
  vertical-align: top;
  margin-left: 5px;
  margin-top: 10px;
  margin-right: 20px;
  line-height: 1.5;

  .subject {
    font-size: 13px;
    margin-bottom: 5px;
  }

  .value {
    font-weight: bold;
    font-size: 15px;

    .changes {
      font-size: 12px;
    }
  }
}
</style>
