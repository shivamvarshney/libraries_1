import { Component, OnInit, Input } from '@angular/core';
//import { PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  piechart_legend_title: String;
  piechart_center_fill_color_code: String;
  piechart_center_text: String;

  @Input() pieChartInformation: any;

  public chartType: string = 'doughnut';
  public chartInnerRadious = '100%';
  public chartData: Array<any> = [];
  public chartLabels: Array<any> = [];
  public chartColors: Array<any> = [];
  //public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [];
  public chartOptions: any;
  public chartClicked(e: any): void {

  }
  public chartHovered(e: any): void {

  }
  constructor() { }

  ngOnInit() {
    this.prepareDataSource();
    this.prepareChartOoptions();
    this.draughtChartPlugin();
  }
  prepareDataSource() {
    this.chartData = this.pieChartInformation.chartData;
    this.chartLabels = this.pieChartInformation.chartLabels;
    this.chartColors = this.pieChartInformation.chartColors;
  }
  draughtChartPlugin() {
    let draughtObj = [{
      beforeDraw(chart: any) {
        if (chart.options.elements.center) {
          const ctx = chart.ctx;
          const txt = chart.options.elements.center.text;
          const sidePadding = chart.options.elements.center.sidePadding;
          const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          const stringWidth = ctx.measureText(txt).width;
          const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
          // Find out how much the font can grow in width.
          const widthRatio = elementWidth / stringWidth;
          const newFontSize = Math.floor(30 * widthRatio);
          const elementHeight = (chart.innerRadius * 2);
          // Pick a new font size so it will not be larger than the height of label.
          const fontSizeToUse = Math.min(newFontSize, elementHeight);
          ctx.font = fontSizeToUse + 'px Arial';
          ctx.fillStyle = chart.options.elements.center.color;
          // Draw text in center
          ctx.fillText(chart.options.elements.center.text, centerX, centerY);
        }
      }
    }];
    //this.doughnutChartPlugins = draughtObj;
  }
  prepareChartOoptions() {
    this.chartOptions = {
      title: {
        display: true,
        text: this.pieChartInformation.legend_title,
        position: 'top'
      },
      elements: {
        center: {
          text: `${this.pieChartInformation.center_text}`,
          color: `${this.pieChartInformation.center_fill_color_code}`, // Default is #000000
          fontStyle: 'Arial', // Default is Arial
          sidePadding: 60 // Defualt is 20 (as a percentage)
        }
      },
      responsive: true,
      cutoutPercentage: 80,
      legend: {
        display: true,
        // labels:{
        //   generateLabels(chart:any){
        //     var data = chart.data;
        //     if (data.labels.length && data.datasets.length) {
        //         https://codepen.io/k3no/pen/WGmVBr
        //     }
        //   }
        // }
      }
    }
  }
}
