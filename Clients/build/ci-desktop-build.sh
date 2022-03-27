echo "Build desktop app"
npx electron-forge make
if [[ ! -d "./out" ]]; then
  echo "Output not generated"
  exit 1
fi
ls ./out
if [[ ! -d "./out/make" ]]; then
  echo "Output make not generated"
  exit 1
fi
echo "Avail makes:";
ls ./out/make;

echo "Ready release dir";
mkdir ./out/release;
if [[ -d "./out/make/deb/" ]]; then
  echo "Output make release deb"
  ls ./out/make/deb;
  cp ../../License/* ./out/make/deb/x64/
  echo "$1" >./out/make/deb/x64/version.txt
  cd ./out/make/deb/x64;
  tar -czvf "../../../../out/release/SimpleWeb-Desktop-deb-x64-$1.tar.gz" ./*.*
fi
if [[ -d "./out/make/rpm/" ]]; then
  echo "Output make release rpm"
  ls ./out/make/rpm;
  cp ../../License/* ./out/make/rpm/x64/
  echo "$1" >./out/make/rpm/x64/version.txt
  cd ./out/make/rpm/x64;
  tar -czvf "../../../../out/release/SimpleWeb-Desktop-rpm-x64-$1.tar.gz" ./*.*
fi

if [[ -d "./out/make/zip/" ]]; then
  echo "Output make release zip"
  ls ./out/make/zip;
  if [[ -d "./out/make/zip/darwin/" ]]; then
    echo "Output make release darwin"
    ls ./out/make/zip/darwin;
    cp ../../License/* ./out/make/zip/darwin/x64/
    echo "$1" >./out/make/zip/darwin/x64/version.txt
    cd ./out/make/zip/darwin/x64;
    tar -czvf "../../../../../out/release/SimpleWeb-Desktop-darwin-x64-$1.tar.gz" ./*.*
  fi
fi
if [[ -d "./out/make/squirrel.windows/" ]]; then
  echo "Output make release windows"
  ls ./out/make/squirrel.windows;
  cp ../../License/* ./out/make/squirrel.windows/x64/
  echo "$1" >./out/make/squirrel.windows/x64/version.txt
  cd ./out/make/squirrel.windows/x64;
  tar -czvf "../../../../out/release/SimpleWeb-Desktop-windows-x64-$1.tar.gz" ./*.*
fi
