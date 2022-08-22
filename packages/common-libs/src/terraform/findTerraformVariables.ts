import axios, { AxiosRequestHeaders } from 'axios';
import { TERRAFORM_API_BASE_URL } from './constants';

export async function findTerraformVariables({
  workspaceId,
  keys,
  headers,
}: {
  workspaceId: string;
  keys: string[];
  headers: AxiosRequestHeaders;
}) {
  const {
    data: { data: variables },
  } = (await axios.get(
    `${TERRAFORM_API_BASE_URL}/workspaces/${workspaceId}/vars`,
    { headers },
  )) as { data: { data: ITerraformVariable[] } };

  return keys.map((key) =>
    variables.find((variable: any) => variable.attributes.key === key),
  );
}

interface ITerraformVariable {
  id: string;
  type: string;
  attributes: {
    key: string;
    value: any;
    sensitive: boolean;
  };
}
