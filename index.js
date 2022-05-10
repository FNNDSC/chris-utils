/*
 index.js file for testing chris-util library.
 */
import 'regenerator-runtime/runtime';
import ClientUtil from "./src/clientUtil";
import PluginUtil from "./src/pluginUtil";

const url = "http://localhost:8000/api/v1/";
const user = "cube";
const pass = "cube1234";

let pluginService;
const upload = document.getElementById("upload");
const id = document.getElementById("id");
const btnPoll = document.getElementById("btnPoll");


// Upload files & create a feed
upload.onchange = async function(){ 
  const service = await ClientUtil.createService(url, user, pass);

  const newFeed = await service.createUploadFeed(upload.files,"firstFeed");


  pluginService = PluginUtil.createService(service.chrisClient);
}

btnPoll.onclick = async function(){
    const service = await ClientUtil.createService(url, user, pass);

    const newFeed = await service.createDownloadFeed(parseInt(id.value),"download");
}

