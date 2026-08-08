import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import path from 'node:path';
export { Contract, ledger, pureCircuits, } from '../src/managed/contract/contract/index.js';
import { Contract } from '../src/managed/contract/contract/index.js';
const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');
export const zkConfigPath = path.resolve(currentDir, '..', 'src', 'managed', 'contract');
export function makeZkCheckContract(datos) {
    return CompiledContract.make('ZkCheckContract', Contract).pipe(CompiledContract.withWitnesses({
        datosPostulante: (context) => [
            context.privateState,
            [datos.ingreso, datos.promedio, datos.edad],
        ],
        secretoPostulante: (context) => [context.privateState, datos.secreto],
        contactoPostulante: (context) => [
            context.privateState,
            datos.contacto ?? new Uint8Array(32),
        ],
    }), CompiledContract.withCompiledFileAssets(zkConfigPath));
}
