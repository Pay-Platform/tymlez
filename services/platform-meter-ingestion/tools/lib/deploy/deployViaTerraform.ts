import assert from 'assert';
import {
  findTerraformWorkspace,
  runTerraform,
  updateTerraformVariables,
  validateMaybeResults,
} from '@tymlez/common-libs';
import { logger } from '@tymlez/backend-libs';

export async function deployViaTerraform({
  gitSha,
  gitTag,
  tfToken,
  workspaceName,
  functionsObject,
}: {
  gitSha: string;
  gitTag: string;
  tfToken: string;
  workspaceName: string;
  functionsObject: string;
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
      key: 'meter_ingestion_functions_object',
      value: functionsObject,
    },
    {
      key: 'meter_ingestion_functions_git_sha',
      value: gitSha,
    },
    {
      key: 'meter_ingestion_functions_git_tag',
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
    message: `Deploy from platform-meter-ingestion: ${gitSha}`,
  });

  logger.info(
    {
      gitSha,
      resultId: runResult.id,
    },
    'Successfully run Terraform',
  );
}
