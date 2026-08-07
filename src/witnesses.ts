import type { Witnesses } from './managed/contract/contract/index.js';

export interface PostulanteData {
  ingreso: bigint;
  promedio: bigint;
  edad: bigint;
  secreto: Uint8Array;
}

export const createWitnesses = (data: PostulanteData): Witnesses<any> => {
  return {
    datosPostulante: (context: any) => [context, [data.ingreso, data.promedio, data.edad]],
    secretoPostulante: (context: any) => [context, data.secreto],
  };
};
