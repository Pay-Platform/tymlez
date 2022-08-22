import assert from 'assert';
import { format } from 'date-fns';
import {
  findTerraformWorkspace,
  runTerraform,
  updateTerraformVariables,
  validateMaybeResults,
} from '@tymlez/common-libs';

export async function deployViaTerraform({
  gitSha,
  gitTag,
  tfToken,
  workspaceName,
}: {
  gitSha: string;
  gitTag: string;
  tfToken: string;
  workspaceName: string;
}) {
  const terraformApiHeaders = {
    Authorization: `Bearer ${tfToken}`,
    'Content-Type': 'application/vnd.api+json',
  };

  const workspace = await findTerraformWorkspace({
    workspaceName,
    headers: terraformApiHeaders,
  });
  assert(workspace, `Cannot find workspace: ${workspaceName}`);

  const entries = [
    {
      key: 'release_date',
      value: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      key: 'git_sha',
      value: gitSha,
    },
    {
      key: 'git_tag',
      value: gitTag,
    },
  ];
  const updateResults = await updateTerraformVariables({
    workspaceId: workspace.id,
    entries,
    headers: terraformApiHeaders,
  });

  validateMaybeResults({
    message: 'Failed to update terraform variables',
    inputs: entries.map((entry) => entry.key),
    results: updateResults,
  });

  const runResult = await runTerraform({
    workspaceId: workspace.id,
    headers: terraformApiHeaders,
    message: `Deploy from platform-middleware: ${gitSha}`,
  });

  console.log('Successfully run Terraform', {
    gitSha,
    resultId: runResult.id,
  });
}
