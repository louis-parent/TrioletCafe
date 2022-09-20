cd api/
npm run $1 &> ../api.log &
apiPID="$!"

cd ../app/
npm run $1 &> ../app.log &
appPID="$!"

cd ..
echo -e "api=$apiPID\napp=$appPID" > .pid
echo "API started with pid $apiPID and App started with pid $appPID"
