function urlFetchMethod()
{
  var options = {};
  // This code uses a "headers" option in order to pass in credentials
    options.headers = {"Authorization": "Basic " + Utilities.base64Encode("username" + ":" + "password")};
  // The code below logs the HTML code of the Google home page.
  var response = UrlFetchApp.fetch("https://www.url_to_use.com/path/to/file", options);
  // This logs the download in the Script logger
  Logger.log(response.getContentText());
  // Save the file in Google Drive
  DriveApp.createFile("output_file_name.txt", response);
}  
