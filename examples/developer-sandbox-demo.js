import { createPrimeDeveloperSandbox } from '../src/sandbox/developer-sandbox.js';

const blueprint = createPrimeDeveloperSandbox({
  workspaceName: 'Prime Pro Services Unified Engineering Console',
});

console.log('=== Prime Developer Sandbox Blueprint ===\n');
console.log(JSON.stringify(blueprint, null, 2));
