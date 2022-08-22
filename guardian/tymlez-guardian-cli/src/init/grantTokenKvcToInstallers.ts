import axios from 'axios';
import type { ITokenResponse } from './ITokenResponse';

export async function grantTokenKycToInstallers({
  GUARDIAN_TYMLEZ_API_KEY,
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
  installers,
  tokens,
}: {
  tokens: ITokenResponse[];
  installers: string[];
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL: string;
  GUARDIAN_TYMLEZ_API_KEY: string;
}) {
  for (const token of tokens) {
    for (const installer of installers) {
      console.log('Granting KYC', { tokenId: token.tokenId, installer });
      await axios.post(
        `${GUARDIAN_TYMLEZ_SERVICE_BASE_URL}/tokens/user-kyc`,
        {
          tokenId: token.tokenId,
          username: installer,
          value: true,
        },
        {
          headers: {
            Authorization: `Api-Key ${GUARDIAN_TYMLEZ_API_KEY}`,
          },
        },
      );
    }
  }
}
