const loPick = require('lodash/pick');
const loCamelCase = require('lodash/camelCase');
// const loForEach = require('lodash/forEach');
const { replaceItems } = require('feathers-hooks-common');
import Service from '@/plugins/service-helpers/service-client.class';
import HookHelper from '@/plugins/service-helpers/hook-helper.class';
import fakeData from '@/seeds/fake-data.json';

const debug = require('debug')('app:services.hook.normalize');
const isDebug = false;

// eslint-disable-next-line no-unused-vars
export default function (options = {}) {
  // Return the actual hook.
  return async (context) => {

    // Create HookHelper object
    const hh = new HookHelper(context);
    // Show debug info
    hh.showDebugInfo('', isDebug);
    // hh.showDebugRecords('', true);

    // let records = hh.contextRecords;
    let _records;
    const fakeDataKey = loCamelCase(hh.contextPath);
    if (isDebug && fakeDataKey) debug('fakeDataKey:', fakeDataKey);

    /**
     * Pick item
     * @param record
     * @return {Object}
     */
    const pickItem = (record) => {
      if (!record) return {};
      // return Object.assign({}, loPick(record, Service.serviceFields(fakeDataKey)));
      record = Object.assign({}, loPick(record, Service.serviceFields(fakeDataKey)));
    };

    if (fakeData[fakeDataKey]) {
      // hh.pickRecords(pickItem);
    }


    // hh.showDebugRecords('', true);

    // Place the modified records back in the context.
    replaceItems(context, hh.contextRecords);
    // Best practice: hooks should always return the context.
    return context;
  };
}

