
/**
 * An instance of this class represents Plugin utility service
 */
export default class PluginUtil{
  /**
   * Constructor
   *
   * @param {Client} chrisClient A Chris Client Object
   */
  constructor(chrisClient){
    this.chrisClient = chrisClient;
  }
  
  /**
   * Create  a service object of this class 
   *
   * @param {Client} chrisClient A ChRIS client object
   * 
   * @return {PluginUtil} An instance of this class
   */
  static createService(chrisClient){
    return new PluginUtil(chrisClient);
  } 
  
  /**
   * Get a plugin id from its given name
   *
   * @param {String} pluginName A name of a chris plugin registered to CUBE
   * 
   * @return {Promise<number>} A JS promise, resolves to a number representing the plugin id
   */
  async getPluginId(pluginName){
  
    const searchParams = {name : pluginName};
    
    const response = await this.chrisClient.getPlugins(searchParams);
    
    return response.data[0].id;
    
  };
  
  /**
   * Run a plugin in CUBE, given its id and params
   *
   * @param {number} pluginId Id of a registered Chris plugin
   * @param {Object} pluginParams parameters of plugin
   *
   * @return {Promise<PluginInstance>} A JS Promise, resolves to a PluginInstance Object
   */
   async runPlugin(pluginId, pluginParams){
     const pluginInst = await this.chrisClient.createPluginInstance(pluginId, pluginParams);
     return pluginInst;
   };
   
   /**
    *
    *
    *
    *
    */
   async pollPlugin(pluginInst, callback, callbackParams){
     
     const instId = pluginInst.data.id;
     
     const delay = ms => new Promise(res => setTimeout(res, ms));
     let status = pluginInst.data.status;
     do {
       await delay(5000);

       const inst = await this.getPluginInstance(instId);
       status = inst.data.status;
       console.log(status);
     }
     while (status !== 'finishedSuccessfully' && status != 'cancelled');
     
     if(status == 'finishedSuccessfully' && callback){
     
         callback(callbackParams)
     }
     
     return status;
     

   };
   
   /**
    * Get a plugin instance running in CUBE from its id
    *
    * @param {number} instId A plugin isntance id
    *
    * @return {Promise<PluginInstance>} A JS Promise, resolves to a PluginInstance object
    */
   async getPluginInstance(instId){
     const pluginInst = await this.chrisClient.getPluginInstance(instId);
     return pluginInst;
   };
}
