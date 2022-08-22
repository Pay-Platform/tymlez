#!/bin/sh

MIGRATE_OPTIONS=''

Help()
{
    # Display Help
   echo "Add description of the script functions here."
   echo
   echo "Syntax: scriptTemplate [-m|h|t]"
   echo "options:"
   echo "--migration [Migration options]    Run migration"
   echo "--help     Print this Help."
   echo
}

Migration() {
    echo "Run migration:up"
    # When migration:up is needed, copy from platform-middleware

    echo "Run seed:up"
    # When seed:up is needed, copy from platform-middleware
}

Run()
{
    echo 'Run application'
    yarn start:prod
}

while [[ $# -gt 0 ]] && [[ $(echo "$1" | cut -c -2) = "--" ]] ;
do
    opt=$1
    shift;
    case "$opt" in
        "--migration") # Run migration
            MIGRATE_OPTIONS=$@
            Migration;;
        "--help") # Show help
            Help
            exit;;
    esac
done

Run
