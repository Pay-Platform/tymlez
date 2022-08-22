import assert from 'assert';
import type { AxiosRequestHeaders } from 'axios';
import { zip } from 'lodash';
import { runAllSettled } from '../async';
import { findTerraformVariables } from './findTerraformVariables';
import { updateTerraformVariable } from './updateTerraformVariable';

export async function updateTerraformVariables({
  workspaceId,
  entries,
  headers,
}: {
  workspaceId: string;
  entries: { key: string; value: string }[];
  headers: AxiosRequestHeaders;
}) {
  const variables = await findTerraformVariables({
    workspaceId,
    keys: entries.map((entry) => entry.key),
    headers,
  });

  return runAllSettled(zip(entries, variables), async ([entry, variable]) => {
    assert(entry, `entry is missing`);
    assert(variable, `Cannot find variable for ${entry.key}`);

    await updateTerraformVariable({
      terraformVar: variable,
      value: entry.value,
      headers,
    });
  });
}
