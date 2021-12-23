import { forEach, get, map, replace, sortBy } from 'lodash';
import moment from 'moment';
// Import stylesheets
const criterias = {
  mode: 'WORKFLOW',
  states: 'EXECUTED',
  prioi: null,
  dtechminl: null,
  hrechminl: null,
  dtechmaxl: null,
  hrechmaxl: null,
  dtdebminl: 20211201,
  hrdebminl: 0,
  dtdebmaxl: 20211223,
  hrdebmaxl: 12052133,
  dtfinminl: null,
  hrfinminl: null,
  dtfinmaxl: null,
  hrfinmaxl: null,
  modelIds: null,
  processIds: null,
  pid: null,
  oris: null,
  idscts: null,
  cdfcts: null,
  taEventShlibs: null,
  taEventState: null,
  executeEventState: 'ack',
  taEventDest: null,
  wkfInstanceids: null,
  actInstanceids: null,
  participant: {
    typdests: 'ORG',
    dests: 'sct001',
  },
  qrydts: null,
  qryRestartPid: '0',
};

const xCrieterias = {
  periodRange: 'Last Three Month',
};

const formatCriteria = (config: any, criterias) => {
  if (config.keyType === 'composite') {
    const values = map(config.key, (value, key) => {
      return {
        key: '$' + key,
        value:
          value.type === 'date'
            ? moment('' + criterias[value.key]).format('YYYY/MM/DD')
            : moment('' + criterias[value.key], 'hhmmss').format('hh:mm:ss'),
      };
    });

    let formatted = config.format;

    forEach(values, (value) => {
      formatted = replace(formatted, value.key, value.value);
    });
    return formatted;
  }

  return get(criterias, config.key, undefined);
};

const getFormatedCriterias = () => {
  const formattedCriteriasConfig = sortBy(
    [
      {
        id: 'fromDate',
        label: 'From',
        key: {
          startDate: { key: 'dtdebmaxl', type: 'date' },
          endDate: { key: 'dtdebminl', type: 'date' },
          startHour: { key: 'hrdebmaxl', type: 'hour' },
          endHour: { key: 'hrdebminl', type: 'hour' },
        },
        displayOrder: 1,
        format: '[$startDate : $startHour...$endDate : $endHour]',
        keyType: 'composite',
      },
      {
        id: 'triggeredBy',
        key: 'participant.dests',
        displayOrder: 2,
        keyType: 'path',
      },
      {
        id: 'status',
        key: 'states',
        displayOrder: 4,
        keyType: 'path',
      },
    ],
    'displayOrder'
  );

  const filtersConfig = {
    ['company']: 'participant.dests',
  };

  let formattedCrietiria = '';

  forEach(formattedCriteriasConfig, (config) => {
    const label = get(config, 'label');
    formattedCrietiria += label ? label + '-' : '';
    formattedCrietiria += formatCriteria(config, criterias) + '-';
  });

  return formattedCrietiria.slice(0, -1);
};

console.log(getFormatedCriterias());
