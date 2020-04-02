ng build --prod
rm -rf dist/covidapp
mv dist/toptalapp dist/covidapp
sudo cp -R dist/covidapp /var/www/html/angular/dist/
