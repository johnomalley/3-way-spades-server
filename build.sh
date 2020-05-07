npm run build
cp package.json dist
(
  # shellcheck disable=SC2164
  cd dist
  npm i --production
)
