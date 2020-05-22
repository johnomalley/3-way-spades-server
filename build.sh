#!/bin/zsh
set -e
set -v
set -u

npm run build
cp package.json dist
(
  # shellcheck disable=SC2164
  cd dist
  npm i --production
)
(
  # shellcheck disable=SC2164
  cd tf
  terraform apply -auto-approve
)
