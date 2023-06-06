set -e
npm run docs:build
cd src/.vuepress/dist

git init
git add -A
git commit -m '发布'

git push -u origin deploy
cd -