set -e
npm run docs:build
cd src/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -u origin deploy
cd -