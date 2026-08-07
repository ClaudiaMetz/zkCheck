import { zkCheckDapp } from './api.js';
import crypto from 'node:crypto';

async function main() {
  const contractAddress = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const mockWallet = {
    callContract: async (params: any) => {
      console.log(`Ejecutando circuito "${params.circuit}" con argumentos:`, params.args);
      return { wait: async () => console.log("Transacción confirmada en el ledger.") };
    }
  };

  const dapp = new zkCheckDapp(contractAddress, mockWallet);
  const procesoId = "beca-sistemas-2026";

  console.log("--- 1. Creando proceso de selección (Admin) ---");
  await dapp.crearProceso(
    procesoId,
    1500000n,
    75n,
    18n,
    25n
  );

  console.log("\n--- 2. Postulando estudiante con datos PRIVADOS ---");
  const secretoAlumno = crypto.randomBytes(32);

  await dapp.postular(procesoId, {
    ingreso: 1200000n,
    promedio: 85n,
    edad: 21n,
    secreto: secretoAlumno,
  });
}

main().catch(console.error);
