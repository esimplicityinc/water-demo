import { Escrow } from './src/domain/escrow/aggregates/Escrow';

// Create an escrow
const escrow = Escrow.create(
  'promise-123',
  'consumer-456',
  'provider-789',
  100,
  'CLAW',
  10
);

console.log('Initial state:', escrow.state.value);

// Start execution
escrow.startExecution('provider-789');

console.log('After startExecution:', escrow.state.value);
