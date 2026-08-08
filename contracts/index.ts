import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import path from 'node:path';

export {
  Contract,
  ledger,
  pureCircuits,
  type Ledger,
  type ImpureCircuits,
  type PureCircuits,
} from '../src/managed/contract/contract/index.js';
import { Contract } from '../src/managed/contract/contract/index.js';

const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');
export const zkConfigPath = path.resolve(currentDir, '..', 'src', 'managed', 'contract');

export type PostulanteWitnessData = {
  ingreso: bigint;
  promedio: bigint;
  edad: bigint;
  secreto: Uint8Array;
  contacto?: Uint8Array;
};

export function makeZkCheckContract(datos: PostulanteWitnessData) {
  return CompiledContract.make('ZkCheckContract', Contract).pipe(
    CompiledContract.withWitnesses({
      datosPostulante: (context: any) => [
        context.privateState,
        [datos.ingreso, datos.promedio, datos.edad],
      ],
      secretoPostulante: (context: any) => [context.privateState, datos.secreto],
      contactoPostulante: (context: any) => [
        context.privateState,
        datos.contacto ?? new Uint8Array(32),
      ],
    }),
    CompiledContract.withCompiledFileAssets(zkConfigPath),
  );
}