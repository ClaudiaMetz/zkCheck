import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  datosPostulante(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, [bigint,
                                                                               bigint,
                                                                               bigint]];
  secretoPostulante(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  crearProceso(context: __compactRuntime.CircuitContext<PS>,
               procesoId_0: Uint8Array,
               ingresoMaximo_0: bigint,
               promedioMinimo_0: bigint,
               edadMinima_0: bigint,
               edadMaxima_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  postular(context: __compactRuntime.CircuitContext<PS>, procesoId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  crearProceso(context: __compactRuntime.CircuitContext<PS>,
               procesoId_0: Uint8Array,
               ingresoMaximo_0: bigint,
               promedioMinimo_0: bigint,
               edadMinima_0: bigint,
               edadMaxima_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  postular(context: __compactRuntime.CircuitContext<PS>, procesoId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  crearProceso(context: __compactRuntime.CircuitContext<PS>,
               procesoId_0: Uint8Array,
               ingresoMaximo_0: bigint,
               promedioMinimo_0: bigint,
               edadMinima_0: bigint,
               edadMaxima_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  postular(context: __compactRuntime.CircuitContext<PS>, procesoId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  procesos: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { ingresoMaximo: bigint,
                                 promedioMinimo: bigint,
                                 edadMinima: bigint,
                                 edadMaxima: bigint,
                                 activo: boolean
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { ingresoMaximo: bigint,
  promedioMinimo: bigint,
  edadMinima: bigint,
  edadMaxima: bigint,
  activo: boolean
}]>
  };
  elegibles: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
