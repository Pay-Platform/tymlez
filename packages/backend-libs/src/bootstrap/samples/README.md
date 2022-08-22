# Steps

1. Copy sample bootstrap and bootstrap-secrets files to client middleware (e.g., cohort-middleware)
2. Update bootstrap and bootstrap-secrets files accordingly.
3. Run `AWS_PROFILE=<client_env> tymlez-cli client-tools bootstrap put-secrets --bootstrapFilePath ./tools/lib/deploy/bootstrap.js --secretsFilePath ./tools/lib/deploy/bootstrap-secrets.js`
4. Above command will upload secrets to the correct S3 bucket and update `secrets_hash` in the bootstrap.js
