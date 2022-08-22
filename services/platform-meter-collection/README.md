# platform-meter-collection

AWS Lambda Functions that collect data and publish to GCP pubsub

# What does it do?

1. It will replace the cron jobs in Bastion host
2. Periodically (5 minutes) call wattwatchers to fetch data
3. Publish the data to pubsub
