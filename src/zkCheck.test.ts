import { describe, it, expect, beforeEach } from 'vitest';
import { zkCheckDapp } from './api.js';
import crypto from 'node:crypto';

describe('zkCheck Contract Logic Tests', () => {
  const contractAddress = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const procesoId = "beca-test-2026";

  // Simulamos la tabla de elegibles del ledger en memoria
  let elegiblesMap: Set<string>;
  let mockWallet: any;
  let dapp: zkCheckDapp;

  beforeEach(() => {
    elegiblesMap = new Set<string>();

    mockWallet = {
      callContract: async (params: any) => {
        if (params.circuit === 'postular') {
          const witnesses = params.witnesses;
          const [, [ingreso, promedio, edad]] = witnesses.datosPostulante({});
          const [, secreto] = witnesses.secretoPostulante({});

          // Simulación de los asserts del circuito Compact
          if (ingreso > 1500000n) {
            throw new Error("Assertion failed: No cumple criterio de ingresos");
          }
          if (promedio < 75n) {
            throw new Error("Assertion failed: No cumple promedio minimo");
          }
          if (edad < 18n || edad > 25n) {
            throw new Error("Assertion failed: Fuera del rango de edad");
          }

          // Armamos una clave unica basada en el secreto y el proceso (simula postulanteId)
          const postulanteHash = Buffer.from(secreto).toString('hex');

          // Assert de duplicado: !elegibles.member(id)
          if (elegiblesMap.has(postulanteHash)) {
            throw new Error("Assertion failed: Ya te postulaste a este proceso");
          }

          // Guardamos el registro si pasa todas las validaciones
          elegiblesMap.add(postulanteHash);
        }
        return { wait: async () => {} };
      }
    };

    dapp = new zkCheckDapp(contractAddress, mockWallet);
  });

  it('debe aceptar a un alumno que cumple todos los requisitos', async () => {
    const secreto = crypto.randomBytes(32);
    await expect(
      dapp.postular(procesoId, {
        ingreso: 1200000n,
        promedio: 85n,
        edad: 21n,
        secreto,
      })
    ).resolves.not.toThrow();
  });

  it('debe RECHAZAR a un postulante que intenta presentarse dos veces', async () => {
    // Usamos la misma clave secreta para simular a la misma persona
    const secretoCompartido = crypto.randomBytes(32);
    const datosPostulacion = {
      ingreso: 1200000n,
      promedio: 85n,
      edad: 21n,
      secreto: secretoCompartido,
    };

    // 1da postulación: Pasa
    await expect(dapp.postular(procesoId, datosPostulacion)).resolves.not.toThrow();

    // 2da postulación con el mismo secreto: Rebota
    await expect(dapp.postular(procesoId, datosPostulacion)).rejects.toThrow(
      "Ya te postulaste a este proceso"
    );
  });

  it('debe RECHAZAR a un alumno que supera el ingreso maximo', async () => {
    const secreto = crypto.randomBytes(32);
    await expect(
      dapp.postular(procesoId, {
        ingreso: 2000000n,
        promedio: 90n,
        edad: 20n,
        secreto,
      })
    ).rejects.toThrow("No cumple criterio de ingresos");
  });

  it('debe RECHAZAR a un alumno con promedio menor al minimo', async () => {
    const secreto = crypto.randomBytes(32);
    await expect(
      dapp.postular(procesoId, {
        ingreso: 1000000n,
        promedio: 60n,
        edad: 22n,
        secreto,
      })
    ).rejects.toThrow("No cumple promedio minimo");
  });

  it('debe RECHAZAR a un alumno fuera del rango de edad permitido', async () => {
    const secreto = crypto.randomBytes(32);
    await expect(
      dapp.postular(procesoId, {
        ingreso: 1000000n,
        promedio: 80n,
        edad: 16n,
        secreto,
      })
    ).rejects.toThrow("Fuera del rango de edad");
  });
});
