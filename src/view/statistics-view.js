import AbstractView from './abstract-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {makeItemsUnique, costByType} from './utils.js';

/*
const typeCtx = document.querySelector('#type');
const timeCtx = document.querySelector('#time');

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться

typeCtx.height = BAR_HEIGHT * 5;
timeCtx.height = BAR_HEIGHT * 5;
*/


export const createStatisticTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
);

export default class StatisticsView extends AbstractView {
  #moneyChart = null;
  #BAR_HEIGHT = 55;

  #routePoints = null;

  constructor (routePoints) {
    super();
    this.#routePoints = routePoints;
    this.#setCharts();
  }

  get template () {
    return createStatisticTemplate();
  }

  #setCharts = () => {
    this.#moneyChart = this.#renderMoneyChart();
  }

  #renderMoneyChart = () => {
    const moneyCtx = this.element.querySelector('#money');
    moneyCtx.height = this.#BAR_HEIGHT * 5;

    const tripPointTypes = this.#routePoints.map((tripPoint) => tripPoint.type);
    const uniquerTypes = makeItemsUnique(tripPointTypes);

    const costsByType = uniquerTypes.map((type) => (costByType(this.#routePoints, type)));
    const sortedTypesByCost = uniquerTypes
      .map((type, index) => ({[type]: costsByType[index]}))
      .sort((itemA, itemB) => (Object.values(itemB)[0] - Object.values(itemA)[0]));

    const sortedTypes = [];
    const sortedCosts = [];
    for (const item of sortedTypesByCost) {
      sortedTypes.push(Object.keys(item)[0].toUpperCase());
      sortedCosts.push(Object.values(item)[0]);
    }

    return new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: sortedTypes,
        datasets: [{
          data: sortedCosts,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
          barThickness: 44,
          minBarLength: 50,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `€ ${val}`,
          },
        },
        title: {
          display: true,
          text: 'MONEY',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}
