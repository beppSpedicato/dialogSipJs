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
    const queryString = window.location.search;
    const query = new URLSearchParams(queryString);
    const num = query.get("num");
    if(config.query_number_permission && num){
        console.log("cioa");
        target = config.sips_enable? "sips:":"sip:" + num + "@" + config.pbx_url;
    } else if(config.default_destination_extention){
        target = config.sips_enable? "sips:":"sip:" + config.default_destination_extention + "@" + config.pbx_url;
    } else {
        messageError.push("default_destination_extention NOT CONFIGURATED");
    }
} else {
    messageError.push("pbx_url NOT CONFIGURATED");
}

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

let stopDiv = getDiv("stop");
let muteDiv = getDiv("mute");


let startCallDiv = getDiv("startCall");
let startCallButton = getButton("startCallButton");
startCallButton.addEventListener("click", () => {
    simpleUser.call(target)
    .then(() => {
        startCallDiv.style.display = "none";
        hangupDiv.style.display = 'block';
        stopDiv.style.display = 'block';
        muteDiv.style.display = 'block';
    })
    .catch((error: Error) => {
        console.error(`[${simpleUser.id}] failed to place call`);
        console.error(error);
        alert("Failed to place call.\n" + error);
    });
})

let hangupDiv = getDiv("hangup");
let hangupButton = getButton("hangupButton");
hangupButton.addEventListener("click", () => {
    simpleUser.hangup()
    .then(() => {
        hangupDiv.style.display = 'none';
        startCallDiv.style.display = 'block';
        stopDiv.style.display = 'none';
        muteDiv.style.display = 'none';
    })
    .catch((error: Error) => {
      console.error(`[${simpleUser.id}] failed to hangup call`);
      console.error(error);
      alert("Failed to hangup call.\n" + error);
    });
});


let muteButton = getButton("muteButton");
let unMuteButton = getButton("unMuteButton");
muteButton.addEventListener("click", () => {
    simpleUser.mute();
    unMuteButton.style.display = "block";
    muteButton.style.display = "none";
})
unMuteButton.addEventListener("click", () => {
    simpleUser.unmute();
    muteButton.style.display = "block";
    unMuteButton.style.display = "none";
});

let stopButton = getButton("stopButton");
let unStopButton = getButton("unStopButton");
stopButton.addEventListener("click", () => {
    simpleUser.hold();
    unStopButton.style.display = "block";
    stopButton.style.display = "none";
})
unStopButton.addEventListener("click", () => {
    simpleUser.unhold();
    stopButton.style.display = "block";
    unStopButton.style.display = "none";
});


setError(messageError);

let timeElement = getDiv("time")
setInterval(() => {
    let time = Math.floor(audioElement.currentTime);
    let res: string = Math.floor(time / 60).toString() + " . " + (time % 60).toString();
    timeElement.innerHTML = res;
},1000)