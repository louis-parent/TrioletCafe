cd api/
npm run dev &> ../api.log &
apiPID="$!"

cd ../app/
npm run dev &> ../app.log &
appPID="$!"

cd ..
echo -e "api=$apiPID\napp=$appPID" > .pid
echo "API started with pid $apiPID and App started with pid $appPID"
