/** * Imports ***/
import Client from "@fnndsc/chrisapi";
import PluginUtil from "./pluginUtil";
import FilesUtil from "./filesUtil";
import FeedUtil from "./feedUtil";

/**
 * An instance of this class represents Client utility service
 */
export default class ClientUtil{

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
   * @param  {String} url CUBE's url
   * @param  {String} userName User's username in CUBE
   * @param  {String} password User's password
   *
   * @return {Promise<ClientUtil>} JS Promise, resolves to an object of this class
   */
  static async createService(url,userName,password){
  
    const authUrl = url + 'auth-token/';
      
    const authToken= await Client.getAuthToken(authUrl, userName,password);
    
    const auth = {token :authToken};
    
    const chrisClient = new Client(url, auth);

    return new ClientUtil(chrisClient);
    
  };
  
  /**
   * Get an instance of Chris Client
   *
   *
   * @return {Client} A ChRIS client object
   */
  getClient(){

      return this.chrisClient;
  };
  
  /**
   * Create a new Feed with the given files
   *
   * @param {Array} files An array of files object
   * @param {String} feedName name of the 'pl-dircopy' instance in CUBE
   *
   * @return {Promise<Feed>}  JS Promise, resolves to a Feed object
   */
  async createUploadFeed(files,feedName){
     
     // Upload files
     const filesService = FilesUtil.createService(this.chrisClient);
     const uploadDirName = await filesService.uploadFiles(files);
    
     // Create a new feed
     const feedService = FeedUtil.createService(this.chrisClient);
     const newFeed = await feedService.createFeed(uploadDirName, feedName);
     return newFeed;
    
  };
    
  /**
   * Create a downloading feed given an existing feed id
   *
   * @param {number} feedId
   * @param {string} newFeedName
   *
   * @return {Promise<Feed>} JS Promise, resolves to a Feed object
   */
  async createDownloadFeed(feedId, newFeedName){
  
    // Fetch the feed
    const feedService = FeedUtil.createService(this.chrisClient);
    const feed = await feedService.getFeed(feedId);
    const feedDirPath = feed.data.creator_username + "/feed_" + feedId;
    
    // create a new feed & zip contents
    const newFeed = await feedService.createAndZipFeed(feedDirPath, newFeedName, feed.data.name);
    return newFeed;
    
  };
   
}
