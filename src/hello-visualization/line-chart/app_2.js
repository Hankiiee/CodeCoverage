const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');
const WebSocket = require('ws');

const url = `ws://${process.env.ENGINE_HOST || 'localhost'}:19076/app/`;
const session = enigma.create({ schema, url, createSocket: url => new WebSocket(url) });
const repos = 12;
// Kanske behövs?
// session.on('traffic:*', (dir, data) => console.log(dir === 'sent' ? '->' : '<-', JSON.stringify(data)));
async function run() {
    // Laddar script (Changed to `` instead of '' to utilize multi lines. added filtering to the load to remove certain repositories)
    var fs = require('fs');
    fs.copyFile('//rd-file/OneData/APTKData/CoverageData/Coverage.qvd', '../../../data/binary.qvd', function(err){
        if (err) throw err;
    });   
    const script = `
  LOAD * FROM [lib://prom/binary.qvd](qvd)
  WHERE NOT Match([repository_name], 'geo-route','geo-mapchart', 'geo-operations', 'geo-server','la-vie','locman','reporting-service','sense-client','api-monitor-service');
`;
    const global = await session.open();
    const doc = await global.createSessionApp();
    await doc.createConnection({
        qType: 'folder',
        qName: 'prom',
        qConnectionString: '/data',
    });
    await doc.setScript(script);
    const reload = doc.doReload();
    const success = await reload;
    const progress = await global.getProgress(reload.requestId);

    if (!success) {
        throw new Error('Reload failed!');
    }

    const numberOfRows = parseFloat(progress.qTransientProgressMessage.qMessageParameters[0].replace(/,/g, ''));
    // console.log("mjello" + JSON.stringify(progress));
    if (numberOfRows > 0) {
        console.log(`${'-'.repeat(78)}\nTotal number of ${numberOfRows} rows fetched from the Prometheus connector.`);
    } else {
        throw new Error('No rows loaded!');
    }
    /*qInitialDataFetch: [
      {
        qHeight: 5,
        qWidth: 2,
      },
  ], */
    const obj = await doc.createObject({
        qInfo: { qType: 'my-data-object' },
        qHyperCubeDef: {
            qInitialDataFetch: [
                {
                    qHeight: 10,
                    qWidth: 4,
                },
            ],
            qStateName: '',
            qDimensions: [
                {
                    'qDef': {
                        qGrouping: 'N',
                        qFieldDefs: [
                            'repository_name',
                        ],
                        qFieldLabels: [
                            '',
                        ],
                        'qSortCriterias': [
                            {
                                'qSortByState': 0,
                                qSortByFrequency: 0,
                                'qSortByNumeric': 1,
                                qSortByAscii: 1,
                                'qSortByLoadOrder': 1,
                                'qSortByExpression': 0,
                                qExpression: {
                                    qv: '',
                                },
                                'qSortByGreyness': 0,
                            },
                        ],
                        qNumberPresentations: [],
                        'qReverseSort': false,
                        qActiveField: 0,
                        qLabelExpression: '',
                        autoSort: true,
                        'othersLabel': 'Others',
                        textAlign: {
                            auto: true,
                            align: 'left',
                        },
                        'representation': {
                            'type': 'text',
                            urlLabel: '',
                        },
                    },
                    qNullSuppression: false,
                    'qIncludeElemValue': false,
                    qOtherTotalSpec: {
                        'qOtherMode': 'OTHER_OFF',
                        qOtherCounted: {
                            'qv': '10',
                        },
                        'qOtherLimit': {
                            qv: '0',
                        },
                        qOtherLimitMode: 'OTHER_GE_LIMIT',
                        'qSuppressOther': false,
                        'qForceBadValueKeeping': true,
                        qApplyEvenWhenPossiblyWrongResult: true,
                        qGlobalOtherGrouping: false,
                        qOtherCollapseInnerDimensions: false,
                        'qOtherSortMode': 'OTHER_SORT_DESCENDING',
                        qTotalMode: 'TOTAL_OFF',
                        qReferencedExpression: {
                            'qv': '',
                        },
                    },
                    'qShowTotal': false,
                    'qShowAll': false,
                    qOtherLabel: {
                        qv: 'Others',
                    },
                    qTotalLabel: {
                        qv: '',
                    },
                    qCalcCond: {
                        'qv': '',
                    },
                    'qAttributeExpressions': [],
                    qAttributeDimensions: [],
                    qCalcCondition: {
                        'qCond': {
                            qv: '',
                        },
                        'qMsg': {
                            qv: '',
                        },
                    },
                },
                {
                    qDef: {
                        'qGrouping': 'N',
                        qFieldDefs: [
                            'TimeStamp',
                        ],
                        'qFieldLabels': [
                            '',
                        ],
                        qSortCriterias: [
                            {
                                'qSortByState': 0,
                                'qSortByFrequency': 0,
                                qSortByNumeric: -1,
                                'qSortByAscii': 1,
                                qSortByLoadOrder: 1,
                                qSortByExpression: 0,
                                'qExpression': {
                                    'qv': '',
                                },
                                qSortByGreyness: 0,
                            },
                        ],
                        qNumberPresentations: [],
                        qReverseSort: false,
                        qActiveField: 0,
                        'qLabelExpression': '',
                        autoSort: false,
                        cId: 'QqFZdWu',
                        othersLabel: 'Others',
                        'textAlign': {
                            'auto': true,
                            align: 'left',
                        },
                        'representation': {
                            'type': 'text',
                            urlLabel: '',
                        },
                    },
                    qNullSuppression: false,
                    qIncludeElemValue: false,
                    'qOtherTotalSpec': {
                        qOtherMode: 'OTHER_OFF',
                        qOtherCounted: {
                            'qv': '10',
                        },
                        qOtherLimit: {
                            qv: '0',
                        },
                        qOtherLimitMode: 'OTHER_GE_LIMIT',
                        'qSuppressOther': false,
                        'qForceBadValueKeeping': true,
                        qApplyEvenWhenPossiblyWrongResult: true,
                        qGlobalOtherGrouping: false,
                        qOtherCollapseInnerDimensions: false,
                        'qOtherSortMode': 'OTHER_SORT_DESCENDING',
                        'qTotalMode': 'TOTAL_OFF',
                        qReferencedExpression: {
                            'qv': '',
                        },
                    },
                    'qShowTotal': false,
                    'qShowAll': false,
                    'qOtherLabel': {
                        'qv': 'Others',
                    },
                    'qTotalLabel': {
                        qv: '',
                    },
                    qCalcCond: {
                        'qv': '',
                    },
                    qAttributeExpressions: [],
                    'qAttributeDimensions': [],
                    qCalcCondition: {
                        qCond: {
                            qv: '',
                        },
                        qMsg: {
                            qv: '',
                        },
                    },
                },
                {
                    'qLibraryId': '',
                    'qDef': {
                        'qGrouping': 'N',
                        'qFieldDefs': [
                            'latest_commit',
                        ],
                        qFieldLabels: [
                            '',
                        ],
                        'qSortCriterias': [
                            {
                                qSortByState: 0,
                                'qSortByFrequency': 0,
                                qSortByNumeric: 1,
                                'qSortByAscii': 1,
                                'qSortByLoadOrder': 1,
                                qSortByExpression: 0,
                                'qExpression': {
                                    'qv': '',
                                },
                                'qSortByGreyness': 0,
                            },
                        ],
                        qNumberPresentations: [],
                        qReverseSort: false,
                        'qActiveField': 0,
                        'qLabelExpression': '',
                        'autoSort': true,
                        cId: 'xxbXHa',
                        'othersLabel': 'Others',
                        textAlign: {
                            auto: true,
                            align: 'left',
                        },
                        'representation': {
                            type: 'text',
                            urlLabel: '',
                        },
                    },
                    'qNullSuppression': false,
                    'qIncludeElemValue': false,
                    'qOtherTotalSpec': {
                        'qOtherMode': 'OTHER_OFF',
                        'qOtherCounted': {
                            qv: '10',
                        },
                        qOtherLimit: {
                            'qv': '0',
                        },
                        'qOtherLimitMode': 'OTHER_GE_LIMIT',
                        qSuppressOther: false,
                        'qForceBadValueKeeping': true,
                        'qApplyEvenWhenPossiblyWrongResult': true,
                        qGlobalOtherGrouping: false,
                        qOtherCollapseInnerDimensions: false,
                        qOtherSortMode: 'OTHER_SORT_DESCENDING',
                        qTotalMode: 'TOTAL_OFF',
                        'qReferencedExpression': {
                            qv: '',
                        },
                    },
                    qShowTotal: false,
                    'qShowAll': false,
                    'qOtherLabel': {
                        'qv': 'Others',
                    },
                    'qTotalLabel': {
                        'qv': '',
                    },
                    'qCalcCond': {
                        'qv': '',
                    },
                    'qAttributeExpressions': [],
                    qAttributeDimensions: [],
                    qCalcCondition: {
                        'qCond': {
                            'qv': '',
                        },
                        'qMsg': {
                            'qv': '',
                        },
                    },
                },
            ],
            qMeasures: [
                {
                    qDef: {
                        'qLabel': '',
                        qDescription: '',
                        qTags: [],
                        qGrouping: 'N',
                        qDef: 'Sum(coverage)',
                        qNumFormat: {
                            qType: 'U',
                            qnDec: 10,
                            'qUseThou': 0,
                            qFmt: '',
                            'qDec': '',
                            qThou: '',
                        },
                        'qRelative': false,
                        'qBrutalSum': false,
                        qAggrFunc: 'Expr',
                        qAccumulate: 0,
                        qReverseSort: false,
                        qActiveExpression: 0,
                        qExpressions: [],
                        qLabelExpression: '',
                        'autoSort': true,
                        'cId': 'gPuYd',
                        'numFormatFromTemplate': true,
                        'textAlign': {
                            'auto': true,
                            'align': 'left',
                        },
                    },
                    qSortBy: {
                        qSortByState: 0,
                        'qSortByFrequency': 0,
                        qSortByNumeric: -1,
                        qSortByAscii: 0,
                        'qSortByLoadOrder': 1,
                        'qSortByExpression': 0,
                        qExpression: {
                            qv: '',
                        },
                        qSortByGreyness: 0,
                    },
                    'qAttributeExpressions': [],
                    'qAttributeDimensions': [],
                    'qCalcCond': {
                        'qv': '',
                    },
                    qCalcCondition: {
                        qCond: {
                            'qv': '',
                        },
                        'qMsg': {
                            'qv': '',
                        },
                    },
                },
            ],
            qInterColumnSortOrder: [
                1,
                0,
                2,
                3,
            ],
        },
    });
    
    // Checks if the year, quarter, month or beat day is missing from the database
    function dateCheck(temp, today, pref) {
        const old = (new Date(temp)).getTime();
        const curr = (new Date(today)).getTime();
        const prefTime = (new Date(pref)).getTime();
        if (curr < old) {
            if (old > prefTime && curr < prefTime) {
                console.log(new Date(today).toISOString().substring(0, 10));
                return new Date(today).toISOString().substring(0, 10);
            }
        }
        return pref;
    }
    const layout = await obj.getLayout();

    let first = 0;
    // ctemp = last coverage and the last time it was changed
    let ctemp = [];
    // bool = helpvariable for ctemp
    const bool = [];
    // current = current coverage
    const current = [];
    // 2D array of every coverage value
    const everything = [];
    const repo_names = [];
    const latest_commit = [];
    let temp = '';
    let date = '';
    let dt;

    const timeSet = [];
    // creates a 2 dimentional array to store the values from a year, quarter... ago
    const theObject = {
        year: [repos - 1],
        month: [repos - 1],
        beat: [repos - 1],
        quarter: [repos - 1],
    };
    // declares what date it was a year, quarter ... ago
    const formatDate = (date, format) => {
        let multiplier;
        switch (format) {
            case 'year':
                multiplier = 31536000000;
                break;
            case 'quarter':
                multiplier = 2628000000 * 4;
                break;
            case 'month':
                multiplier = 2628000000;
                break;
            case 'beat':
                multiplier = (1209600000);
                break;
            default:
                multiplier = 1;
        }
        return (new Date(date - multiplier)).toISOString().substring(0, 10);
    };
    dt = new Date();
        /*
        year = (new Date(dt - 31536000000)).toISOString().substring(0,10);
        quarter = (new Date(dt - (2628000000*4))).toISOString().substring(0,10);
        month = (new Date(dt - 2628000000)).toISOString().substring(0,10);
        beat = (new Date(dt - (86400000*14))).toISOString().substring(0,10);
        */
    year = formatDate(dt, 'year');
    quarter = formatDate(dt, 'quarter');
    month = formatDate(dt, 'month');
    beat = formatDate(dt, 'beat');
    console.log('Beat ' + beat);
    // creates 2D arrays
    for (let j = 0; j < repos; j++) {
        everything[j] = [];
    }
    // Iterates the whole database and returns every row readable with .qText

    var pageOne;
    var count = 0;
    var k = 10000 / layout.qHyperCube.qSize.qcx;
    var index = 0;
    var repoNames = [];
    console.log(k + " Rows per page");
    while (numberOfRows >= count) {
        pageOne = await obj.getHyperCubeData('/qHyperCubeDef', [{ qTop: count, qLeft: 0, qWidth: 4, qHeight: k }]);
        var data;
        data = pageOne[0].qMatrix.map((item) => {
            index++;
            everything[first % repos][Math.floor(first / repos)] = `${item[3].qText},${item[1].qText}`;
            if (first < repos) {
                // prints out the first objects, the same amount as the amount of repos 0:Repo name, 1:Sampling date, 2:Latest commit, 3:Coverage
                console.log(`${item[0].qText}   ${item[1].qText}    ${item[2].qText}    ${item[3].qText}`);
                // Saves the current coverage values
                repoNames[first] = item[0].qText;
                current[first] = (item[3].qText);
                ctemp[first] = item[3].qText;
                repo_names[first] = item[0].qText;
                latest_commit[first] = item[2].qText;
            }
            else {
                // Saves the latest coverage different to the current along with its date
                if (ctemp[first % repos] != item[3].qText && bool[first % repos] != 1) {
                    ctemp[first % repos] = `${item[3].qText},${item[1].qText}`;
                    bool[first % repos] = 1;
                }
                beat = dateCheck(temp, item[1].qText, beat);
                month = dateCheck(temp, item[1].qText, month);
                quarter = dateCheck(temp, item[1].qText, quarter);
                year = dateCheck(temp, item[1].qText, year);

                // if (item[1].qText !== year && item[1].qText !== month && item[1].qText !== month && item[1].qText !== beat) { return; }
                // Checks to see if the date is a year, quarter ... ago to begin sampling
                switch (item[1].qText) {
                    case year:
                        theObject.year[first % repos] = item[3].qText;
                        break;
                    case quarter:
                        theObject.quarter[first % repos] = item[3].qText;
                        break;
                    case month:
                        theObject.month[first % repos] = item[3].qText;
                        break;
                    case beat:
                        theObject.beat[first % repos] = item[3].qText;
                        break;
                    default:

                }
            }
            temp = item[1].qText;
            first += 1;
        });
        console.log(index);
        count += k;
    }
    console.log('helllllloooooooo' + ctemp + 'stop');
    console.log(JSON.stringify(current));
    console.log(temp);
    let i;
    let average = 0;
    for (i = 0; i < repos; i++) {
        if (current[i] != '-') { average += parseFloat(current[i]); }
    }
    average /= repos;
    console.log(temp);
    console.log(average);
    console.log(`${theObject.year}year     ${theObject.quarter}quarter   ${theObject.month}month  ${theObject.beat}done`);
    var jsons = [];
    var change; 
    for(var j = 0; j < repos; j++){
        change = ctemp[j].split(",");
        jsons[j] = {
            name: repoNames[j],
            currProc: current[j],
            lastProc: change[0],
            lastCommit: latest_commit[j],
            lastChange: change[1],
            beat: theObject.beat[j],
            month: theObject.month[j],
            quarter: theObject.quarter[j],
            year: theObject.year[j]
            }
    }
    console.log(jsons);
    const content = JSON.stringify(jsons).replace(/\"([^(\")"]+)\":/g,"$1:"); 
    fs.writeFile("../../../data/content.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
    await session.close();
}
(async () => {
    try {
        await run();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();
