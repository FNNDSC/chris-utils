/** * Imports ***/
import PluginUtil from "./pluginUtil";
import FilesUtil from "./filesUtil";

/**
 * An instance of this class represents Feed utility service
 */
export default class FeedUtil{

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
   * @return {FeedUtil} An instance of this class
   */
  static createService(chrisClient){
    return new FeedUtil(chrisClient);
  };
  
  /**
   * Get a feed given it's id
   *
   * @param {number} feedId A Feed id
   *
   * @return {Promise<Feed>} JS Promise, resolves to a feed object
   */
  async getFeed(feedId){
    const feed = await this.chrisClient.getFeed(feedId);
    return feed;
      
  }
  
  /**
   * Create a new feed in CUBE
   *
   * @param {String} dataPath A path in Chris Swift Storage
   * @param {String} feedName Name of a new feed
   *
   * @return {Promise<Feed>} A JS Promise, resolves to a Feed object
   */
  async createFeed(dataPath, feedName){
  
    // Get plugin id of pl-dircopy
    const pluginService = PluginUtil.createService(this.chrisClient);
    const dircopyId = await pluginService.getPluginId("pl-dircopy");
    const dircopyParams = {dir:dataPath,previous_id: 0,title:feedName};
    
    // Schedule a new pl-dircopy and return the feed
    const dircopyInst = await pluginService.runPlugin(dircopyId, dircopyParams);
    const newFeed = await dircopyInst.getFeed();
    return newFeed;
  }
  
  /**
   * A method to create, zip & download a new feed
   *
   * @param {String} dataPath A valid path in Chris Swift storage
   * @param {String} feedName Name of the new feed
   * @param {String} zipName A file name
   *
   * @return {Promise<Feed>} A JS Promise, resolves to a Feed Object
   */
  async createAndZipFeed(dataPath, feedName, zipName){
    
    // Get plugin id of pl-dircopy
    const pluginService = PluginUtil.createService(this.chrisClient);
    const dircopyId = await pluginService.getPluginId("pl-dircopy");
    const dircopyParams = {dir:dataPath,previous_id: 0,title:feedName};
    
    // Schedule a new pl-dircopy and return the feed
    const dircopyInst = await pluginService.runPlugin(dircopyId, dircopyParams);
    const pfdorunId = await pluginService.getPluginId("pl-pfdorun");
    const pfdorunParams = {
       title: "zip_files",
       previous_id: dircopyInst.data.id,
       inputFile: "input.meta.json",
       noJobLogging: true,
       exec: "'zip -r %outputDir/parent.zip %inputDir'"
    };
    console.log("Please wait while we are zipping your files");
    const pfdoInst =  await pluginService.runPlugin(pfdorunId, pfdorunParams);
    
    // Poll & download
    await pluginService.pollPlugin(pfdoInst);
    
    const fileService = FilesUtil.createService(this.chrisClient);
    fileService.downloadZip(pfdoInst, zipName)
    
    const newFeed = await pfdoInst.getFeed();
    return newFeed;
    
  };
  
  
    
  /**
   * Get the cumulative run time of a given feed
   *
   * @param {Object} feed A Feed object
   *
   * @return {Promise<number>} A JS Promise, resolves to a number representing feed's run time
   *
   */
  async getRunTime(feed){
      const pluginInstances = await feed.getPluginInstances();
      
      var totalRunTime = 0;
      
      for(var pluginInstance of pluginInstances.data){
        var startTime = Date.parse(pluginInstance.start_date);
        var endTime = Date.parse(pluginInstance.end_date);
        
        totalRunTime += (endTime - startTime);
      }
      
      return totalRunTime/60000;
   };
    
  /**
   * Get the total file size of a given feed
   *
   * @param {object} feed A Feed object
   *
   * @return {Promise<number>} A JS Promise, resolves to a number represnting feed's size
   */
  async getSize(feed){
      const pluginInstances = await feed.getPluginInstances();
      
      var totalSize = 0;
      
      for(var pluginInstance of pluginInstances.data){
        
        totalSize += pluginInstance.size;
      }
      
      return totalSize/1000000;
   };
    
  /**
   * Get the progress of a given feed
   *
   * @param {Object} feed A Feed object
   *
   * @return {Promise<number>} A JS Promise, resolves to a number representing feed's progress
   */
  async getProgress(feed){
    
      const LOOKUP = new Map();
      LOOKUP.set("cancelled",0);
      LOOKUP.set("started",1);
      LOOKUP.set("waiting",2);
      LOOKUP.set("registeringFiles",3);
      LOOKUP.set("finishedSuccessfully",4);
                      
      const pluginInstances = await feed.getPluginInstances();
      
      const totalMilestones = pluginInstances.data.length * 4;
      var completedMilestones = 0;
      
      for(var pluginInstance of pluginInstances.data){
        var status = pluginInstance.status;
        completedMilestones += LOOKUP.get(status);
      }
      
      var progressPercentage = (completedMilestones/ totalMilestones) * 100;
      
      return progressPercentage;
      
  };
    

}
