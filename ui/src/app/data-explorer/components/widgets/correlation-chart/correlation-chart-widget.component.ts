/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Component, OnInit } from '@angular/core';
import { BaseDataExplorerWidgetDirective } from '../base/base-data-explorer-widget.directive';
import { CorrelationChartWidgetModel } from './model/correlation-chart-widget.model';
import { DataExplorerField, SpQueryResult } from '@streampipes/platform-services';

@Component({
  selector: 'sp-data-explorer-correlation-chart-widget',
  templateUrl: './correlation-chart-widget.component.html',
  styleUrls: ['./correlation-chart-widget.component.scss']
})
export class CorrelationChartWidgetComponent extends BaseDataExplorerWidgetDirective<CorrelationChartWidgetModel> implements OnInit {

  colNo = 2;
  fixedColNo = 2;
  rowNo = 2;

  data = [];

  graph = {
    layout: {
      grid: {rows: this.rowNo, columns: this.fixedColNo, pattern: 'independent'},
      xaxis: {
        title: {
          text: ''
        }
      },
      yaxis: {
        title: {
          text: ''
        }
      },
      font: {
        color: '#FFF'
      },
      autosize: true,
      plot_bgcolor: '#fff',
      paper_bgcolor: '#fff'
    },
    config: {
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toggleSpikelines', 'toImage'],
      displaylogo: false,
      displayModeBar: false,
      responsive: true
    }
  };

  refreshView() {
    this.updateAppearance();
  }

  lightenColor(color: string, percent: number) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const B = (num >> 8 & 0x00FF) + amt;
    const G = (num & 0x0000FF) + amt;
    const result = '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                  (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    return result;
  }

  prepareData(result: SpQueryResult[]) {

    const xIndex = this.getColumnIndex(this.dataExplorerWidget.visualizationConfig.firstField, result[0]);
    const yIndex = this.getColumnIndex(this.dataExplorerWidget.visualizationConfig.secondField, result[0]);

    this.data = [];

    const len = result[0].allDataSeries.length;

    const even = len % this.colNo === 0;

    this.rowNo = even ? len / this.fixedColNo : (len + 1) / this.fixedColNo;

    this.colNo = len === 1 ? 1 : this.fixedColNo;

    let rowCount = 0;
    let colCount = 0;

    let colorVal = '#015c0d';

    result[0].allDataSeries.map((group, findex) => {

      let groupName;

      if (group['tags'] != null) {
        Object.entries(group['tags']).forEach(
          ([key, val]) => {
            groupName = val;
          });
      }

      groupName = groupName === undefined ? 'density' : groupName;

      let sizeVal;
      let opacityVal;

      if (this.dataExplorerWidget.visualizationConfig.displayType === 'Density') {
        sizeVal = 2;
        opacityVal = 0.4;
      } else {
        sizeVal = 5;
        opacityVal = 0.9;
      }

      const xaxisVal = findex !== 0 ? 'x' + (findex + 1).toString() : 'x';
      const yaxisVal = findex !== 0 ? 'y' + (findex + 1).toString() : 'y';

      const component = {
        x: this.transform(group.rows, xIndex),
        y: this.transform(group.rows, yIndex),
        mode: 'markers',
        name: groupName,
        marker: {
          color: colorVal,
          size: sizeVal,
          opacity: opacityVal,
        },
        type: 'scatter',
        xaxis: xaxisVal,
        yaxis: yaxisVal,
        // domain: {
        //   row: rowCount,
        //   column: colCount,
        // },
      };

      this.data.push(component);

      if (this.dataExplorerWidget.visualizationConfig.displayType === 'Density') {

        const component2 = {
          x: this.transform(group.rows, xIndex),
          y: this.transform(group.rows, yIndex),
          name: groupName,
          ncontours: 20,
          colorscale: 'Hot',
          reversescale: true,
          showscale: false,
          type: 'histogram2dcontour',
          xaxis: xaxisVal,
          yaxis: yaxisVal,
          // domain: {
          //   row: rowCount,
          //   column: colCount,
          // },
        };

        this.data.push(component2);

      }
      if (colCount === (this.colNo - 1)) {
        colCount = 0;
        rowCount += 1;
       } else {
         colCount += 1;
       }

       colorVal = this.lightenColor(colorVal, 11.);

    });
  }

  transform(rows, index: number): any[] {
    return rows.map(row => row[index]);
  }

  updateAppearance() {
    this.graph.layout.paper_bgcolor = this.dataExplorerWidget.baseAppearanceConfig.backgroundColor;
    this.graph.layout.plot_bgcolor = this.dataExplorerWidget.baseAppearanceConfig.backgroundColor;
    this.graph.layout.font.color = this.dataExplorerWidget.baseAppearanceConfig.textColor;
    this.graph.layout.xaxis.title.text = this.dataExplorerWidget.visualizationConfig.firstField.fullDbName;
    this.graph.layout.yaxis.title.text = this.dataExplorerWidget.visualizationConfig.secondField.fullDbName;
    this.graph.layout.grid = {
      rows: this.rowNo,
      columns: this.colNo,
      pattern: 'independent'
    };
  }

  onResize(width: number, height: number) {
    this.graph.layout.autosize = false;
    (this.graph.layout as any).width = width;
    (this.graph.layout as any).height = height;
  }

  beforeDataFetched() {
  }

  onDataReceived(spQueryResult: SpQueryResult[]) {
    this.prepareData(spQueryResult);
    this.updateAppearance();
    this.setShownComponents(false, true, false, false);
  }

  handleUpdatedFields(addedFields: DataExplorerField[], removedFields: DataExplorerField[]) {
    this.dataExplorerWidget.visualizationConfig.firstField =
      this.triggerFieldUpdate(this.dataExplorerWidget.visualizationConfig.firstField, addedFields, removedFields);

    this.dataExplorerWidget.visualizationConfig.secondField =
      this.triggerFieldUpdate(this.dataExplorerWidget.visualizationConfig.secondField, addedFields, removedFields);
  }

  triggerFieldUpdate(selected: DataExplorerField,
                     addedFields: DataExplorerField[],
                     removedFields: DataExplorerField[]): DataExplorerField {
    return this.updateSingleField(
      selected,
      this.fieldProvider.numericFields,
      addedFields,
      removedFields,
      (field) => field.fieldCharacteristics.numeric
    );
  }

}
