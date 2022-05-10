# chris-utils API
JavaScript 6 client for the chris-utils API.


## Usage

``` javascript
import ClientUtil from 'chris-utils';

const url = "http://localhost:8000/api/v1/";
const user = "cube";
const pass = "cube1234";

// Get a service object
const clientService = await ClientUtil.getService(url,user,pass);

// Access public methods 
.
.
.
const newFeed = await clientService.createUploadFeed(files,feedName);

```



## Error handling




## API reference

Please check the API reference links to learn more about the `ClientUtil` object and other API resource objects and their functionality.


