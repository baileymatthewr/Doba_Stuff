function fetch(url, username, password, output_path){
  var authorization = "Basic " + Utilities.base64Encode(username + ":" + password) 
  var options = {};
  options.headers = {
    "Authorization": authorization
  };
  var response = UrlFetchApp.fetch(url, options);
  // Logger.log(response.getContentText());
  DriveApp.createFile(output_path, response);
}  
