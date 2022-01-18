import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { isPlatformBrowser } from '@angular/common';
import { getFileDelivers } from '@api/eventos';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

export interface FileDelivers {
  node_delivered_files: {
    fid: number;
    nomenclatura: string;
    cumulus_node: {
      name: string;
    };
  };
  who_delivers: string;
  reception_date: string;
  audio_files: number;
  video_files: number;
  image_files: number;
  total_files: number;
}

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.scss'],
})
export class EntregasComponent implements OnInit {
  fileDelivers: FileDelivers[] = [];
  searchFilterList: FileDelivers[] = [];
  searchField: string = 'node';
  currentSearchValue: string = '';
  activeSection = 'table';

  private chart: am4charts.PieChart;
  private barChart: am4charts.XYChart;

  constructor(private apollo: Apollo, @Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  async getFileDelivers() {
    try {
      const {
        data: { delivered_files },
      }: any = await this.apollo
        .query({
          query: getFileDelivers,
          variables: {
            pagination: {
              limit: 100,
              offset: 0,
            },
          },
        })
        .toPromise();
      this.fileDelivers = delivered_files;
      this.searchFilterList = delivered_files;
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  async ngAfterViewInit() {
    await this.getFileDelivers();
    this.chartTotalEachType();
    this.chartCumulusTotal();
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  chartTotalEachType() {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('chartdiv', am4charts.PieChart);

      let title = chart.titles.create();
      title.text = 'Total de archivos entregados';
      title.fontSize = 35;
      title.align = 'left';
      title.marginBottom = 30;

      chart.paddingRight = 20;

      let data = [];
      let typesOfFile = [
        ['audio_files', 'Archivos de audio'],
        ['image_files', 'Archivos de imágenes'],
        ['video_files', 'Archivos de video'],
      ];
      for (let i = 0; i < typesOfFile.length; i++) {
        data.push({
          typeOfFile: typesOfFile[i][1],
          count: this.getTotals(typesOfFile[i][0], true),
        });
      }

      chart.data = data;

      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'count';
      pieSeries.dataFields.category = 'typeOfFile';

      pieSeries.colors.list = [
        am4core.color('#FFE162'),
        am4core.color('#FF6464'),
        am4core.color('#91C483'),
        am4core.color('#EEEEEE'),
        am4core.color('#FFC75F'),
        am4core.color('#F9F871'),
      ];

      this.chart = chart;
    });
  }

  chartCumulusTotal() {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('cumuluschart', am4charts.XYChart);

      let title = chart.titles.create();
      title.text = 'Total de archivos entregados por cúmulo';
      title.fontSize = 35;
      title.align = 'left';
      title.marginBottom = 30;

      chart.paddingRight = 20;

      chart.data = this.getTotalByCumulus();

      chart.colors.list = [
        am4core.color('#91C483'),
        am4core.color('#FFE162'),
        am4core.color('#FF6464'),
        am4core.color('#91C483'),
        am4core.color('#EEEEEE'),
        am4core.color('#FFC75F'),
        am4core.color('#F9F871'),
      ];

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'cumulus';
      categoryAxis.title.text = 'Cúmulos';

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Archivos totales entregados';

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'cumulus';
      series.dataFields.valueY = 'total';
      series.tooltipText = '{valueY}';

      chart.cursor = new am4charts.XYCursor();

      this.barChart = chart;
    });
  }

  /**
   * onSearchInout - changes the displayed list by filtering it with the given string value
   *
   * @param value A string to filter the totals list
   */
  onSearchInput(value: string) {
    this.currentSearchValue = value;
    if (value.length) {
      this.searchFilterList = this.fileDelivers.filter((d) => {
        let fieldToFilter: string;
        if (this.searchField.includes('node')) fieldToFilter = d.node_delivered_files.fid.toString();
        else if (this.searchField.includes('who_delivers')) fieldToFilter = d.who_delivers.toLowerCase();
        else if (this.searchField.includes('reception_date'))
          fieldToFilter = d.reception_date.split('-').reverse().join().replace(/,/g, '/');

        return fieldToFilter.indexOf(value.toLowerCase()) > -1;
      });
    } else {
      this.searchFilterList = this.fileDelivers;
    }
  }

  onSelect(value: any) {
    this.searchField = value;
    this.onSearchInput(this.currentSearchValue);
  }

  /**
   * getTotals - get the total value for each type of file
   *
   * @param field         Field to search and count
   * @param throughAll   Boolean var to check if count through all
   *                        or just the filtered list
   *
   * @returns             The total for the specific type of field
   */
  getTotals(field: string, throughAll: boolean = false) {
    let total = 0;

    if (!throughAll) this.searchFilterList.forEach((f) => (total += f[field]));
    else this.fileDelivers.forEach((f) => (total += f[field]));

    return total;
  }

  getTotalByCumulus() {
    let totals = [];
    this.searchFilterList.forEach((f) => {
      let found = totals.find((c) => c.cumulus == f.node_delivered_files.cumulus_node.name);
      if (found) {
        totals[totals.indexOf(found)].total += f.total_files;
      } else {
        totals.push({
          cumulus: f.node_delivered_files.cumulus_node.name,
          total: f.total_files,
        });
      }
    });

    return totals;
  }

  segmentChanged(event: any) {
    this.activeSection = event.target.value;
  }
}
