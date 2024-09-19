// A hook that logs service method before, after and error
import HookHelper from '@/plugins/service-helpers/hook-helper.class';

const debug = require('debug')('app:services.hook.log');
const isDebug = false;

export default function () {
  return context => {

    // Create HookHelper object
    const hh = new HookHelper(context);
    // Show debug info
    hh.showDebugInfo('', isDebug);
    hh.showDebugError();
  };
}
