import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  deployContract,
  submitCallTx,
  type DeployedContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { type EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import pino from 'pino';

import { getConfig } from './config.js';
import { MidnightWalletProvider, syncWallet, type WalletSecret } from './wallet.js';
import { buildProviders, type ZkCheckProviders } from './providers.js';
import { Contract, ledger, zkConfigPath, makeZkCheckContract } from '../contracts/index.js';

globalThis.WebSocket = WebSocket;

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const ADMIN_SEED =
  '0000000000000000000000000000000000000000000000000000000000000001';

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';

function resolveSecret(): WalletSecret {
  return { kind: 'seed', value: ADMIN_SEED };
}

function datosElegibles(secreto: Uint8Array, contacto?: Uint8Array) {
  return { ingreso: 1_200_000n, promedio: 85n, edad: 21n, secreto, contacto };
}

const POSTULANTE_STATE_ID = 'zkCheckPostulanteState';

describe(`zkCheck Contract (${network})`, () => {
  let wallet: MidnightWalletProvider;
  let providers: ZkCheckProviders;
  let contractAddress: ContractAddress;

  const config = getConfig();
  const secret = resolveSecret();
  const syncTimeoutMs = 10 * 60_000;

  async function queryLedger() {
    const state = await providers.publicDataProvider.queryContractState(contractAddress);
    expect(state).not.toBeNull();
    return ledger(state!.data);
  }

  beforeAll(async () => {
    setNetworkId(config.networkId);

    const envConfig: EnvironmentConfiguration = {
      walletNetworkId: config.networkId,
      networkId: config.networkId,
      indexer: config.indexer,
      indexerWS: config.indexerWS,
      node: config.node,
      nodeWS: config.nodeWS,
      faucet: config.faucet,
      proofServer: config.proofServer,
    };

    wallet = await MidnightWalletProvider.build(logger, envConfig, secret);
    await wallet.start();
    await syncWallet(logger, wallet.wallet, syncTimeoutMs);

    providers = buildProviders(wallet, zkConfigPath, config);
    logger.info(`Providers initialized on '${network}'. Ready to test!`);

    const compiled = makeZkCheckContract(datosElegibles(new Uint8Array(32)));
    const deployed: DeployedContract<Contract> = await (deployContract<Contract>)(
      providers,
      {
        compiledContract: compiled,
        privateStateId: POSTULANTE_STATE_ID,
        initialPrivateState: {},
      },
    );
    contractAddress = deployed.deployTxData.public.contractAddress;
    logger.info(`Contract deployed at: ${contractAddress}`);
  });

  afterAll(async () => {
    if (wallet) {
      logger.info('Stopping wallet...');
      await wallet.stop();
    }
  });

  async function postularCon(datos: ReturnType<typeof datosElegibles>) {
    const compiled = makeZkCheckContract(datos);
    return (submitCallTx<Contract, 'postular'>)(providers, {
      compiledContract: compiled,
      contractAddress,
      privateStateId: POSTULANTE_STATE_ID,
      circuitId: 'postular',
    });
  }

  async function reclamarCon(datos: ReturnType<typeof datosElegibles>) {
    const compiled = makeZkCheckContract(datos);
    return (submitCallTx<Contract, 'reclamarBeca'>)(providers, {
      compiledContract: compiled,
      contractAddress,
      privateStateId: POSTULANTE_STATE_ID,
      circuitId: 'reclamarBeca',
    });
  }

  it('un postulante que cumple todos los criterios queda registrado como elegible', async () => {
    const secreto = crypto.getRandomValues(new Uint8Array(32));
    await expect(postularCon(datosElegibles(secreto))).resolves.toBeDefined();

    const estado = await queryLedger();
    expect(estado.totalPostulaciones).toBeGreaterThan(0n);
  });

  it('un postulante con ingreso por encima del maximo SE POSTULA pero queda no-elegible', async () => {
    const secreto = crypto.getRandomValues(new Uint8Array(32));
    const datos = { ...datosElegibles(secreto), ingreso: 2_000_000n };

    await expect(postularCon(datos)).resolves.toBeDefined();
    await expect(reclamarCon(datos)).rejects.toThrow('No sos elegible para esta beca');
  });

  it('rechaza una segunda postulacion con el mismo secreto', async () => {
    const secreto = crypto.getRandomValues(new Uint8Array(32));
    const datos = datosElegibles(secreto);
    await postularCon(datos);
    await expect(postularCon(datos)).rejects.toThrow('Ya te postulaste');
  });

  it('un elegible puede reclamar y recibir su contacto guardado', async () => {
    const secreto = crypto.getRandomValues(new Uint8Array(32));
    const contactoHash = crypto.getRandomValues(new Uint8Array(32));
    const datos = datosElegibles(secreto, contactoHash);

    await postularCon(datos);
    await expect(reclamarCon(datos)).resolves.toBeDefined();
  });

  it('rechaza reclamar sin haberse postulado antes', async () => {
    const secretoNuevo = crypto.getRandomValues(new Uint8Array(32));
    const datos = datosElegibles(secretoNuevo);
    await expect(reclamarCon(datos)).rejects.toThrow('No te postulaste');
  });

  it('rechaza reclamar dos veces', async () => {
    const secreto = crypto.getRandomValues(new Uint8Array(32));
    const datos = datosElegibles(secreto, crypto.getRandomValues(new Uint8Array(32)));

    await postularCon(datos);
    await reclamarCon(datos);
    await expect(reclamarCon(datos)).rejects.toThrow('Ya reclamaste esta beca');
  });
});