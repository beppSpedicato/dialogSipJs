git clone https://github.com/onsip/SIP.js
rm -r SIP.js/demo
rm SIP.js/tsconfig-base.json
mv dialogConfigContent/* SIP.js/
cd SIP.js
npm i
cd demo
npm run build-demo
