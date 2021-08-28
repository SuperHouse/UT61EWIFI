CWD="$(pwd)";

echo "Building simple web";
cd ./Clients/SimpleWeb/web;
npm ci;
npm run build;

cd $CWD;

echo "Building node red";
cd ./Clients/Node-RED;
node build.js;

cd $CWD;

echo "desktop app deps...";
apt-get update -y;
apt-get install --no-install-recommends -y zip build-essential fakeroot dpkg-dev rpm-build;

echo "Building desktop app";
cd ./Clients/Desktop;
npm ci;
node build.js;