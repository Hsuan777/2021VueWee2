set: -e
rm dist

mkdir dist
cd dist
cp ../index.html index.html
cp -r ../js js
cp -r ../css css
cd css 
rm *.map
cd ..

git init
git add -A
git commit -m "deploy"
git branch -M gh-pages
git remote add origin https://github.com/hsuan777/2021VueWee2.git
git push -f origin gh-pages

cd -