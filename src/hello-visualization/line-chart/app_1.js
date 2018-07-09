/* eslint-env browser */

import Halyard from 'halyard.js';
import angular from 'angular';
import enigma from 'enigma.js';
import enigmaMixin from 'halyard.js/dist/halyard-enigma-mixin';
import qixSchema from 'enigma.js/schemas/3.2.json';
import template from './app_1.html';
import Linechart from './barchart';

const halyard = new Halyard();

angular.module('app', []).component('app', {
  bindings: {},
  controller: ['$scope', '$q', '$http', function Controller($scope, $q, $http) {
    $scope.dataSelected = false;
    $scope.showFooter = false;

    $scope.toggleFooter = () => {
      $scope.showFooter = !$scope.showFooter;
      if (!$scope.showFooter && $scope.dataSelected) {
        this.clearAllSelections();
      }
    };

    $scope.openGithub = () => {
      window.open('https://github.com/qlik-oss/core-get-started');
    };

    this.connected = false;
    this.painted = false;
    this.connecting = true;

    let object = null;
    let app = null;

    const select = (value) => {
      app.getField('Movie').then((field) => {
        field.select(value).then(() => {
          $scope.dataSelected = true;
          this.getMovieInfo().then(() => {
            $scope.showFooter = true;
          });
        });
      });
    };

    const linechart = new Linechart();

    const paintChart = (layout) => {
      linechart.paintLinechart(document.getElementById('chart-container'), layout, {
        select,
        clear: () => this.clearAllSelections(),
        hasSelected: $scope.dataSelected,
      });
      this.painted = true;
    };

    this.generateGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = Math.random() * 16 | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });

    this.$onInit = () => {
      const config = {
        Promise: $q,
        schema: qixSchema,
        mixins: enigmaMixin,
        url: `ws://${window.location.hostname}:19076/app/${this.generateGUID()}`,
      };

      // Add local data
      /*
      const filePathMovie = '/data/sw.csv';
      const tableMovie = new Halyard.Table(filePathMovie, {
        name: 'Movies',
        fields: [{ src: 'Season', name: 'Season' }, { src: 'Episode', name: 'Episode' },
        { src: 'Rating', name: 'Rating' }, { src: 'Episode Number', name: 'Episode Number' }, { src: 'Votes', name: 'Votes' }],
      delimiter: ',',
    });
      halyard.addTable(tableMovie);
*/
const filePathMovie = '/data/Coverage_henrik.qvd';
      const tableMovie = new Halyard.Table(filePathMovie, {
        name: 'Movies',
        fields: [{ src: 'coverage', name: 'coverage' }, { src: 'repository_name', name: 'repository_name' },
        { src: 'updatestamp', name: 'updatestamp' }, { src: 'commitid', name: 'commitid' }, { src: 'TimeStamp', name: 'TimeStamp' }],
      delimiter: ',',
    });
    halyard.addTable(tableMovie);

    
    console.log("efter" + JSON.stringify(tableMovie, null, 2));
      // Add web data
      $http.get('https://gist.githubusercontent.com/carlioth/b86ede12e75b5756c9f34c0d65a22bb3/raw/e733b74c7c1c5494669b36893a31de5427b7b4fc/MovieInfo.csv')
        .then((data) => {
          const table = new Halyard.Table(data.data, { name: 'MoviesInfo', delimiter: ';', characterSet: 'utf8' });
          halyard.addTable(table);
        })
        .then(() => {
          enigma.create(config).open().then((qix) => {
            this.connected = true;
            this.connecting = false;
            qix.createSessionAppUsingHalyard(halyard).then((result) => {
              app = result;
              result.getAppLayout()
                .then(() => {
                  const linechartProperties = {
                    qInfo: {
                      qType: 'visualization',
                      qId: '',
                    },
                    type: 'my-picasso-scatterplot',
                    labels: true,
                    qHyperCubeDef: {
                      qDimensions: [{
                        qDef: {
                          qFieldDefs: ['repository_name'],
                          /* qNumberPresentations: [{
                              qType:"D"
                          }], */
                          qSortCriterias: [{
                            qSortByAscii: 1,
                          }],
                        },
                      },{
                        qDef: {
                          qFieldDefs: ['updatestamp'],
                          /* qNumberPresentations: [{
                              qType:"D"
                          }], */
                          qSortCriterias: [{
                            qSortByAscii: 1,
                          }],
                        },
                      }
                    ],
                      qMeasures: [{
                        qDef: {
                          qDef: 'Sum(coverage)',
                          qLabel: 'Rating',
                        },
                        qSortBy: {
                          qSortByNumeric: -1,
                        },
                      },
                      ],
                      
                      qInitialDataFetch: [{
                        qTop: 0, qHeight: 122, qLeft: 0, qWidth: 3,
                      }],
                      qSuppressZero: false,
                      qSuppressMissing: true,
                    },
                  };
                  result.createSessionObject(linechartProperties).then((model) => {
                    object = model;

                    const update = () => object.getLayout().then((layout) => {
                      paintChart(layout);
                    });

                    object.on('changed', update);
                    update();
                  });
                });
            }, () => {
              this.error = 'Could not create session app';
              this.connected = false;
              this.connecting = false;
            });
          }, () => {
            this.error = 'Could not connect to QIX Engine';
            this.connecting = false;
          });
        });
    };

    this.clearAllSelections = () => {
      if ($scope.dataSelected) {
        $scope.dataSelected = false;
        app.clearAll();
      }
      $scope.showFooter = false;
    };

    this.getMovieInfo = () => {
      const tableProperties = {
        qInfo: {
          qType: 'visualization',
          qId: '',
        },
        type: 'my-info-table',
        labels: true,
        qHyperCubeDef: {
          qDimensions: [{
            qDef: {
              qFieldDefs: ['Movie'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Image'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Year'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Genre'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Description'],
            },
          },
          ],
          qInitialDataFetch: [{
            qTop: 0, qHeight: 50, qLeft: 0, qWidth: 50,
          }],
          qSuppressZero: false,
          qSuppressMissing: true,
        },
      };
      return app.createSessionObject(tableProperties)
        .then(model => model.getLayout()
          .then((layout) => { Linechart.showDetails(layout); }));
    };
  }],
  template,
});

angular.bootstrap(document, ['app']);
