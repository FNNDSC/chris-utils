/** * Imports ***/
import {Request} from "@fnndsc/chrisapi";
import FileSaver from 'file-saver';
/**
 * An instance of this class represents Files utility service
 */
export default class FilesUtil{
  /**
   * Constructor
   *
   * @param {Client} chrisClient A Chris Client Object
   */
  constructor(chrisClient){
    this.chrisClient = chrisClient;
  }
  
  /**
   * Create a service object of this class
   *
   * @param {Client} chrisClient A Chris Client object
   *
   * @return {FilesUtil} An instance of this class
   */
  static createService(chrisClient){
  
    return new FilesUtil(chrisClient);
  }

  /**
   * Upload files to CUBE
   *
   * @param {Array} files An array of files object
   *
   * @return {Promise<String>}  JS Promise, resolves to a string value representing a Swift store location
   */
  async uploadFiles(files){
    if(files.length==0){
      console.log("Please upload files!");
    }
    
    //Upload all files to CUBE
    const user = await this.chrisClient.getUser();
    const uploadDir = user.data.username + '/uploads/' + Date.now() + '/';
    for(var f=0;f<files.length;f++){
          var upload = await this.chrisClient.uploadFile({
          upload_path: uploadDir+ files[f].name
          },{
          fname: files[f]
          });
    }
      
    return uploadDir;
    
  };
  
  /**
   * Download files of a given plugin instance
   *
   * @param {Object} pluginInstance
   */
  async downloadFiles(pluginInstance){
  };
  
  /**
   * Download a zip file of a given pfdorun instance
   *
   * @param {PluginInstance} pfdoInst Id of a particular ``pfdo`` instance in CUBE
   * @param {String} zipName File name for the downloading zip
   * 
   */
  async downloadZip(pfdoInst,zipName){
    const params = { limit: 200, offset: 0 };
    const pluginFiles = await pfdoInst.getFiles(params);

    for(const pluginFile of pluginFiles.collection.items){
      const filePath = pluginFile.data[2].value;
      const paths = filePath.split('/');
      const fileName = paths[paths.length-1];
      if(fileName=='parent.zip'){
        const resp = await this._download(pluginFile.links[0].href);
        FileSaver.saveAs(resp, zipName+".zip");
      } 
      
    }
    
  };
  
  /**
   * Private method to download a blob/file/stream from CUBE 
   *
   * @param {String} url API endpoint to a particular resource in CUBE
   * @return {Promise<Blob>} JS promise, resolves to a ``Blob`` object
   */
  _download(url){
    const req = new Request(this.chrisClient.auth, 'application/octet-stream', 30000000);
    const blobUrl = url;
    return req.get(blobUrl).then(resp => resp.data);
  };
  
  
}
