import axios, { AxiosRequestHeaders } from 'axios';
import type { IIsoDate } from '@tymlez/platform-api-interfaces';
import { TERRAFORM_API_BASE_URL } from './constants';

export async function runTerraform({
  workspaceId,
  headers,
  message,
}: {
  workspaceId: string;
  headers: AxiosRequestHeaders;
  message: string;
}) {
  const {
    data: { data: result },
  } = (await axios.post(
    `${TERRAFORM_API_BASE_URL}/runs`,
    {
      data: {
        attributes: {
          'is-destroy': false,
          message,
        },
        type: 'runs',
        relationships: {
          workspace: {
            data: {
              type: 'workspaces',
              id: workspaceId,
            },
          },
        },
      },
    },
    { headers },
  )) as { data: { data: ITerraformRunResult } };

  return result;
}

interface ITerraformRunResult {
  id: string;
  type: string;
  attributes: {
    'created-at': IIsoDate;
    'is-destroy': boolean;
    message: string;
  };
}
