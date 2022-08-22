import axios, { AxiosRequestHeaders } from 'axios';
import type { IIsoDate } from '@tymlez/platform-api-interfaces';
import { TERRAFORM_API_BASE_URL, TF_ORG } from './constants';

export async function findTerraformWorkspace({
  workspaceName,
  headers,
}: {
  workspaceName: string;
  headers: AxiosRequestHeaders;
}) {
  const {
    data: { data: workspaces },
  } = (await axios.get(
    `${TERRAFORM_API_BASE_URL}/organizations/${TF_ORG}/workspaces`,
    { headers },
  )) as { data: { data: ITerraformWorkspace[] } };

  const workspace = workspaces.find(
    (ws: any) => ws.attributes.name === workspaceName,
  );

  return workspace;
}

interface ITerraformWorkspace {
  id: string;
  attributes: {
    name: string;
    'updated-at': IIsoDate;
  };
  type: string;
}
