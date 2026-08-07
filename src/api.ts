import { createWitnesses, type PostulanteData } from './witnesses.js';

export class zkCheckDapp {
  constructor(
    private contractAddress: string,
    private walletContext: any
  ) {}

  static stringToBytes32(text: string): Uint8Array {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const result = new Uint8Array(32);
    result.set(bytes.slice(0, 32));
    return result;
  }

  async crearProceso(
    procesoIdStr: string,
    ingresoMaximo: bigint,
    promedioMinimo: bigint,
    edadMinima: bigint,
    edadMaxima: bigint
  ) {
    const procesoId = zkCheckDapp.stringToBytes32(procesoIdStr);
    
    const emptyWitnesses = createWitnesses({
      ingreso: 0n,
      promedio: 0n,
      edad: 0n,
      secreto: new Uint8Array(32),
    });

    const tx = await this.walletContext.callContract({
      address: this.contractAddress,
      circuit: 'crearProceso',
      args: [procesoId, ingresoMaximo, promedioMinimo, edadMinima, edadMaxima],
      witnesses: emptyWitnesses,
    });

    return tx.wait();
  }

  async postular(procesoIdStr: string, datosPrivados: PostulanteData) {
    const procesoId = zkCheckDapp.stringToBytes32(procesoIdStr);
    const witnesses = createWitnesses(datosPrivados);

    const tx = await this.walletContext.callContract({
      address: this.contractAddress,
      circuit: 'postular',
      args: [procesoId],
      witnesses: witnesses,
    });

    return tx.wait();
  }
}
