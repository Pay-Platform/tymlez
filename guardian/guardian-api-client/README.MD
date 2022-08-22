# guardian-api-client

## Generate client configuration

### Prerequisites

JAVA and open api generation tools

```
cd ~

brew install openjdk

echo 'export PATH="/usr/local/opt/openjdk/bin:$PATH"' >> .bash_profile

source .bash_profile

```

### generate

```

openapi-generator-cli generate  -g typescript-axios -i  swagger.yaml -o ./src --skip-validate-spec

```
