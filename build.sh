npm run build
cp package.json dist
(
  cd dist
  npm i --production
)
