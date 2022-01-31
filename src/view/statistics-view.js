import AbstractView from './abstract-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {makeItemsUnique, costByType, countTripPointsByType, timeByType, minutesToHumanFormat, setOutputLayoutDateTime} from './utils.js';

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
  #typeChart = null;
  #durationChart = null;
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

  removeElement = () => {
    super.removeElement();

    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }

    if (this.#typeChart) {
      this.#typeChart.destroy();
      this.#typeChart = null;
    }

    if (this.#durationChart) {
      this.#durationChart.destroy();
      this.#durationChart = null;
    }
  }

  #setCharts = () => {
    this.#moneyChart = this.#renderMoneyChart();
    this.#typeChart = this.#renderTypeChart();
    this.#durationChart = this.#renderTimeByTypeChart();
  }

  #renderMoneyChart = () => {
    const moneyCtx = this.element.querySelector('#money');

    const tripPointTypes = this.#routePoints.map((tripPoint) => tripPoint.type);
    const uniquerTypes = makeItemsUnique(tripPointTypes);

    const costsByType = uniquerTypes.map((type) => (costByType(this.#routePoints, type)));
    const sortedTypesByCost = uniquerTypes
      .map((type, index) => ({[type]: costsByType[index]}))
      .sort((itemA, itemB) => (Object.values(itemB)[0] - Object.values(itemA)[0]));

    moneyCtx.height = this.#BAR_HEIGHT * sortedTypesByCost.length;

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

  #renderTypeChart = () => {
    const typeCtx = this.element.querySelector('#type');

    const tripPointTypes = this.#routePoints.map((tripPoint) => tripPoint.type);
    const uniquerTypes = makeItemsUnique(tripPointTypes);

    const tripPointByTypeCounts = uniquerTypes
      .map((type) => ({[type]: countTripPointsByType(this.#routePoints, type)}))
      .sort((itemA, itemB) => (Object.values(itemB)[0] - Object.values(itemA)[0]));

    typeCtx.height = this.#BAR_HEIGHT * tripPointByTypeCounts.length;

    const sortedTypes = [];
    const sortedTypeCounts = [];
    for (const item of tripPointByTypeCounts) {
      sortedTypes.push(Object.keys(item)[0].toUpperCase());
      sortedTypeCounts.push(Object.values(item)[0]);
    }

    return new Chart(typeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: sortedTypes,
        datasets: [{
          data: sortedTypeCounts,
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
            formatter: (val) => `${val}x`,
          },
        },
        title: {
          display: true,
          text: 'TYPE',
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

  #renderTimeByTypeChart = () => {
    const timeByTypeCtx = this.element.querySelector('#time');

    const tripPointTypes = this.#routePoints.map((tripPoint) => tripPoint.type);
    const uniquerTypes = makeItemsUnique(tripPointTypes);

    const tripPointByTypeTime = uniquerTypes
      .map((type) => ({[type]: timeByType(this.#routePoints, type)}))
      .sort((itemA, itemB) => (Object.values(itemB)[0] - Object.values(itemA)[0]));

    // расчет высоты канваса
    timeByTypeCtx.height = this.#BAR_HEIGHT * tripPointByTypeTime.length;

    const sortedTypes = [];
    const sortedMinutes = [];
    for (const item of tripPointByTypeTime) {
      sortedTypes.push(Object.keys(item)[0].toUpperCase());
      sortedMinutes.push(Object.values(item)[0]);
    }

    return new Chart(timeByTypeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: sortedTypes,
        datasets: [{
          data: sortedMinutes,
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
            formatter: (minutes) => `${setOutputLayoutDateTime(minutesToHumanFormat(minutes))}`,
          },
        },
        title: {
          display: true,
          text: 'TIME',
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
