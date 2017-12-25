rm -rf .deploy
mkdir .deploy
cp CNAME .deploy/CNAME
cp index.html .deploy/index.html
cp -R dist .deploy/
cd .deploy
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:cube-ui/cube-issue-helper.git master:gh-pages
