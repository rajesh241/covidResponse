# ng build --prod # --verbose=true --progress=true
# npm run post-build
# Combines the above two commands
npm run build  # This will do versioning as well
sudo cp -Rv dist/covidapp /var/www/html/angular/
