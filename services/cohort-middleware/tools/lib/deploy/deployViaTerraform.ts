import assert from 'assert';
import { format } from 'date-fns';
import {
  findTerraformWorkspace,
  runTerraform,
  updateTerraformVariables,
  validateMaybeResults,
} from '@tymlez/common-libs';
import { validateAndAddSecrets, logger } from '@tymlez/backend-libs';

const bootstrap = require('./bootstrap');

export async function deployViaTerraform({
  env,
  gitSha,
  gitTag,
  tfToken,
  workspaceName,
  clientName,
}: {
  env: string;
  gitSha: string;
  gitTag: string;
  tfToken: string;
  workspaceName: string;
  clientName: string;
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
      key: 'client_release_date',
      value: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      key: 'client_git_sha',
      value: gitSha,
    },
    {
      key: 'client_git_tag',
      value: gitTag,
    },
    {
      key: 'client_bootstrap_data',
      value: JSON.stringify(
        await validateAndAddSecrets({ env, clientName, bootstrap }),
      ),
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
    message: `Deploy from cohort-middleware: ${gitSha}`,
  });

  logger.info(
    {
      gitSha,
      resultId: runResult.id,
    },
    'Successfully run Terraform',
  );
}
