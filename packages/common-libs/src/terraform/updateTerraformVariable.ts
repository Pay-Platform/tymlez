import axios, { AxiosRequestHeaders } from 'axios';
import { TERRAFORM_API_BASE_URL } from './constants';

export async function updateTerraformVariable({
  terraformVar,
  value,
  headers,
}: {
  terraformVar: {
    id: string;
    attributes: { key: string; value: string; sensitive: boolean };
  };
  value: Object;
  headers: AxiosRequestHeaders;
}) {
  console.log(
    `Updating Terraform variable ${terraformVar.attributes.key} from ${terraformVar.attributes.value}` +
      'to %s',
    !terraformVar.attributes.sensitive ? value : '<sensitive value>',
  );

  await axios.patch(
    `${TERRAFORM_API_BASE_URL}/vars/${terraformVar.id}`,
    {
      data: {
        id: terraformVar.id,
        attributes: {
          key: terraformVar.attributes.key,
          value,
        },
      },
    },
    { headers },
  );
}
