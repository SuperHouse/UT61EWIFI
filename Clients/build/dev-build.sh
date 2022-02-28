CWD="$(pwd)";
RELD="$CWD/Clients/build/release";
VERS="0.1-dev-only"

mkdir $RELD;
rm -rfv "$RELD/*";

bash "$CWD/Clients/build/build.sh";
cd $CWD;


echo "Versioning simple web";
cd ./Clients/SimpleWeb/web;
SWV="$VERS";
echo "Release simple web";
cd ./dist;
echo "$SWV" > ./version.txt;
cp ../../../../License/* ./;
mkdir "$RELD/SimpleWeb-WebUI-$SWV";
cp -Rv ./*.* "$RELD/SimpleWeb-WebUI-$SWV/";

cd $CWD;

echo "Versioning node red";
cd ./Clients/Node-RED/dist;
NRV="$VERS";
echo "Release node red";
echo "$NRV" > ./version.txt;
cp ../../../License/* ./;
mkdir "$RELD/SimpleWeb-NodeRED-$NRV";
cp -Rv ./*.* "$RELD/SimpleWeb-NodeRED-$NRV/";

cd $CWD;

echo "Release desktop app";
cd ./Clients/Desktop;
DAV="$VERS";
npx electron-forge make;
cp ../../License/* ./out/make/deb/x64/;
echo "$DAV" > ./out/make/deb/x64/version.txt;
mkdir "$RELD/SimpleWeb-Desktop-deb-x64-$DAV";
cp -Rv ./out/make/deb/x64/*.* "$RELD/SimpleWeb-Desktop-deb-x64-$DAV/";
cp ../../License/* ./out/make/rpm/x64/;
echo "$DAV" > ./out/make/rpm/x64/version.txt;
mkdir "$RELD/SimpleWeb-Desktop-rpm-x64-$DAV";
cp -Rv ./out/make/rpm/x64/*.* "$RELD/SimpleWeb-Desktop-rpm-x64-$DAV/";

cd $CWD;
echo "RELVERSION=$VERS";