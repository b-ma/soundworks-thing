/**
 * Client-side entry point of the *soundworks* framework.
 *
 * @module soundworks/client
 * @example
 * import * as soundworks from 'soundworks/client';
 */

// version (cf. bin/javascripts)
export const version = '%version%';

// core
export { default as Activity } from './core/Activity';
export { default as client } from './core/client';
export { default as Experience } from './core/Experience';
export { default as Process } from './core/Process';
export { default as Service } from './core/Service';
export { default as serviceManager } from './core/serviceManager';

// services
export { default as Checkin } from './services/Checkin';
export { default as ErrorReporter } from './services/ErrorReporter';
export { default as Sync } from './services/Sync';
// export { default as SyncScheduler } from './services/SyncScheduler';

