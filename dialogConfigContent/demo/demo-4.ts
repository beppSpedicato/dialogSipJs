import { getAudio, getButton, getButtons, getInput, getSpan, getDiv } from "./demo-utils";
import { SimpleUser, SimpleUserDelegate, SimpleUserOptions } from "../src/platform/web";
let messageError: string[] = [];
const setError = (message: string[]) => {
    if(message.length){
        let boxDiv = getDiv("callDiv");
        boxDiv.style.display = 'none';
        let res = "ERRORE NELLA CONFIGURAZIONE DELLA MODAL: <br>";
        for(let i of message)
            res += "&emsp; - " + i + "<br>";
        let errorDiv = getDiv("error");
        errorDiv.style.display = "block";
        errorDiv.innerHTML = res;
    }
}

const config = require("../dialogConfig.json");

// Destination URI
let target = "";

if(config.pbx_url){
    if(config.query_number_permission){
        const queryString = window.location.search;
        const num = new URLSearchParams(queryString).get("num");
        target = config.sips_enable? "sips:":"sip:" + num + "@" + config.pbx_url;
    } else if(config.default_destination_extention){
        target = config.sips_enable? "sips:":"sip:" + config.default_destination_extention + "@" + config.pbx_url;
    } else {
        messageError.push("default_destination_extention NOT CONFIGURATED");
    }
} else {
    messageError.push("pbx_url NOT CONFIGURATED");
}




// Name for demo user

// WebSocket Server URL
if(!config.webSocket_server) { 
    messageError.push("webSocket_server NOT CONFIGURATED")
}
const webSocketServer = config.webSocket_server;


// SimpleUser delegate
const simpleUserDelegate: SimpleUserDelegate = {
    onCallCreated: (): void => {
    },
    onCallAnswered: (): void => {
    },
    onCallHangup: (): void => {
    },
    onCallHold: (held: boolean): void => {
    }
};

// Audio element for call
let audioElement = getAudio("audio");

// SimpleUser options
if(!config.userAgentOptions) {
    messageError.push("userAgentOptions NOT CONFIGURATED");
}
let simpleUserOptions: SimpleUserOptions = {
    aor: "",
    delegate: simpleUserDelegate,
    media: {
        remote: {
            audio: audioElement
        } 
    },
    userAgentOptions: config.userAgentOptions
};

const simpleUser: SimpleUser = new SimpleUser(webSocketServer, simpleUserOptions);


let connected = false;

let dialogButton = getButton("dialogButton")
dialogButton.addEventListener("click", () => {
    getDiv("dropdown").style.display = 'block';
    if(!connected)
        simpleUser.connect().then(() => {
            connected = true;
        });
})

let closeButton = getButton("closeDrop");
closeButton.addEventListener("click", () => {
    getDiv("dropdown").style.display = 'none';
    if(connected)
        simpleUser.disconnect().then(() => {
            connected = false;
        })
})


let startCallDiv = getDiv("startCall");
let startCallButton = getButton("startCallButton");
startCallButton.addEventListener("click", () => {
    startCallDiv.style.display = "none";
    hangupDiv.style.display = 'block';
    simpleUser.call(target).catch((error: Error) => {
        console.error(`[${simpleUser.id}] failed to place call`);
        console.error(error);
        alert("Failed to place call.\n" + error);
    });
})

let hangupDiv = getDiv("hangup");
let hangupButton = getButton("hangupButton");
hangupButton.addEventListener("click", () => {
    hangupDiv.style.display = 'none';
    startCallDiv.style.display = 'block';
    simpleUser.hangup().catch((error: Error) => {
      console.error(`[${simpleUser.id}] failed to hangup call`);
      console.error(error);
      alert("Failed to hangup call.\n" + error);
    });
});

setError(messageError);

let timeElement = getDiv("time")
setInterval(() => {
    let time = Math.floor(audioElement.currentTime);
    let res: string = Math.floor(time / 60).toString() + " . " + (time % 60).toString();
    timeElement.innerHTML = res;
},1000)