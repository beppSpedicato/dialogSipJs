# dialogSipJs

## SETUP ALL

### clone into project directory sip.js

```
-$ git clone https://github.com/onsip/SIP.js
```

### Replace demo folder and ts configuration in sip.js directory with dialogContentConfig demo folder

```
-$ rm -r SIP.js/demo
```
```
-$ rm tsconfig-base.json
```
```
-$ mv dialogConfigContent/* SIP.js/
```

### Move into sip.js folder and install node_modules
```
-$ cd SIP.js
```
```
-$ npm i
```

### Build the dialog project
```
-$ cd SIP.js/demo 
```
```
-$ npm run build-demo
```

###### if you see "Cannot find name 'require'" error don't worry, it's normal

## Now the component is ready

### For import it into your html/php page you need to:
## add style.css to your page
  ```<link rel="stylesheet" href="path/to/dialogSipJs/style.css" />```

## add the div with the iframe to your body
```
<div class="iframe-container">
    <iframe src="path/to/dialogSipJs/SIP.js/demo/index.html"></iframe>
</div>
```


# CONFIG CALLER DIALOG
#### For the configuration go (after setup) into SIP.js/dialogContent.json



