import axios from 'axios';
import fs from 'fs';
import path from 'path';
import type { ITokenResponse } from './ITokenResponse';

export async function createTokens({
  GUARDIAN_TYMLEZ_API_KEY,
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
}: {
  GUARDIAN_TYMLEZ_API_KEY: string;
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
}) {
  const existingTokens = await getExistingTokens({
    GUARDIAN_TYMLEZ_API_KEY,
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
  });

  const INIT_TOKENS = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `./policies/${process.env.CLIENT_NAME}/tokens.json`),
      'utf8',
    ),
  ) as ITokenRequest[];

  const pendingTokens = INIT_TOKENS.filter(
    (initToken) =>
      !existingTokens.some(
        (existingToken) => existingToken.tokenSymbol === initToken.tokenSymbol,
      ),
  );

  console.log(
    'Creating tokens',
    pendingTokens.map((token) => token.tokenSymbol),
  );

  for await (const token of pendingTokens) {
    await axios.post(
      `${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/tokens/create`,
      token,
      {
        headers: {
          Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
        },
      },
    );
    console.log('Token created', token.tokenSymbol);
  }

  return (
    await getExistingTokens({
      GUARDIAN_TYMLEZ_API_KEY,
      GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    })
  ).filter((token) =>
    INIT_TOKENS.some(
      (initToken) => initToken.tokenSymbol === token.tokenSymbol,
    ),
  );
}

async function getExistingTokens({
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
  GUARDIAN_TYMLEZ_API_KEY,
}: {
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
  GUARDIAN_TYMLEZ_API_KEY: string;
}) {
  return (
    (await axios.get(`${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/tokens`, {
      headers: {
        Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
      },
    })) as { data: ITokenResponse[] }
  ).data;
}

interface ITokenRequest {
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
  decimals: string;
  initialSupply: string;
  enableAdmin: boolean;
  changeSupply: boolean;
  enableFreeze: boolean;
  enableKYC: boolean;
  enableWipe: boolean;
}
