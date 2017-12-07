function parseEmailsWithTracking(start) {

  start = start || 0;
  
  var shipping_threads = GmailApp.search("in:inbox fedex shipment", start, 500);
  
  for (var i = 0; i < shipping_threads.length; i++) {

    var message = shipping_threads[i].getMessages()[0];
    var sender = message.getFrom();
    var subject = message.getSubject();
    var content = message.getPlainBody();
    var tmp;
    var order_id;
    var invoice_number;
    var sku;
    var quantity;
    var tracking_number;
    var carrier;
    var ship_date;
    var ship_price;
    var ship_weight;
    var total_product_cost;
    var sheet;
    var tracking_label;
    var tmp_thread;
    var sheetname;
    
    //------------------FedEx Emails------------------//
    if (!content.match(/.*SPORTS LICENSING.*/)) {
      if (content && sender && subject) {
        tmp = content.match(/Purchase order number:\s+(\d+)(\r?\n)/);
        //------------THE FORMAT IS STANDARD-------------//
        if(tmp && tmp[1]) {
            
          tmp = content.match(/Purchase order number:\s+(\d+)(\r?\n)/);
          order_id = (tmp[1]) ? tmp[1].trim() : "";
            
          tmp = content.match(/Reference:\s+(\d+)(\r?\n)/);
          invoice_number = (tmp[1]) ? tmp[1].trim() : "";
            
          tmp = content.match(/Number of pieces:\s+(\d+)(\r?\n)/);
          quantity = (tmp[1]) ? tmp[1].trim() : "";
            
          tmp = content.match(/Tracking number:\s+(\d+)/);
          tracking_number = (tmp[1]) ? tmp[1].trim() : "";
            
          tmp = content.match(/Weight:\s+([0-9]+\.[0-9]+)\s+.*(\r?\n)/);
            
          ship_weight = (tmp[1]) ? tmp[1] : "";
            
        } else {
            
          //------------THE FORMAT IS DIFFERENT-------------//
          tmp = content.match(/Purchase order number:\*\s+(\d+)/);
          order_id = (tmp[1]) ? tmp[1].trim() : "";

          tmp = content.match(/Reference:\*\s+(\d+)/);
          invoice_number = (tmp[1]) ? tmp[1].trim() : "";

          tmp = content.match(/Number of pieces:\*\s+(\d+)/);
          quantity = (tmp[1]) ? tmp[1].trim() : "";

          tmp = content.match(/Tracking number:\*\s+(\d+)/);
          tracking_number = (tmp[1]) ? tmp[1].trim() : "";

          tmp = content.match(/Weight:\*\s+([0-9]+\.[0-9]+)\s+.*/);
          ship_weight = (tmp[1]) ? tmp[1] : "";
        }
        if(tracking_number != "" && order_id != "") {
           
          // Correct the order_id and invoice_number if necessary
          if(tracking_number.length == 12 && invoice_number.length == 8 && order_id == 7) {
            tmp = invoice_number;
            invoice_number = order_id;
            order_id = tmp;
          }

          sku = "";
          carrier = "FedEx";
          ship_date = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd");
          ship_price = "";
          total_product_cost = "";
          sheetname = "Northwest";
          sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname);
            
          //----------------------The Output File---------------------//
          // [     1       ][    2            ][   3    ][     4     ][     5    ][    6    ][     7    ][     8     ][    9        ][     10           ]
          // [     A       ][    B            ][   C    ][     D     ][     E    ][    F    ][     G    ][     H     ][    I        ][      j           ]
          //    order_id    | invoice_number   | sku     | quantity  |   tracking | carrier  | ship_date | ship_price | ship_weight | total_product_cost
          sheet.appendRow([order_id, invoice_number, sku, quantity, tracking_number, carrier, ship_date, ship_price, ship_weight, total_product_cost]);
            
          // Move the email from inbox to tracking && mark as read
          message.markRead();
          tracking_label = GmailApp.getUserLabelByName("Tracking");
          tmp_thread = message.getThread();
          tmp_thread.addLabel(tracking_label).moveToArchive();
        }
      }
    } else if(content.match(/.*SPORTS LICENSING.*/)) {
      if (content && sender && subject) {
        
        tmp = content.match(/Purchase order number:\*\s+(\d+)/);
        if(tmp[1]) {
          order_id = tmp[1].trim();
        } else {
          tmp = content.match(/Purchase order number:\*\s+(\d+)(\r?\n)/);
          order_id = tmp[1].trim();
        }
        
        tmp = content.match(/Invoice number:\*\s+(\d+)/);
        if(tmp[1]) {
          invoice_number = tmp[1].trim();
        } else {
          tmp = content.match(/Invoice number:\*\s+(\d+)(\r?\n)/);
          invoice_number = tmp[1].trim();
        }

        tmp = content.match(/Number of pieces:\*\s+(\d+)/);
        if(tmp[1]) {
          quantity = tmp[1].trim();
        } else {
          tmp = content.match(/Number of pieces:\*\s+(\d+)(\r?\n)/);
          quantity = tmp[1].trim();
        }

        tmp = content.match(/Tracking number:\*\s+(\d+)/);
        if(tmp[1]) {
          tracking_number = tmp[1].trim();
        } else {
          tmp = content.match(/Tracking number:\*\s+(\d+)(\r?\n)/);
          tracking_number = tmp[1].trim();
        }

        tmp = content.match(/Weight:\*\s+([0-9]+\.[0-9]+)\s+.*/);
        if(tmp[1]) {
          ship_weight = tmp[1].trim();
        } else {
          tmp = content.match(/Weight:\*\s+([0-9]+\.[0-9]+)\s+.*(\r?\n)/);
          ship_weight = tmp[1].trim();
        }

        sku = "";
        carrier = "FedEx";
        ship_date = Utilities.formatDate(new Date(), "GMT-7", "yyyy-MM-dd");
        ship_price = "";
        total_product_cost = "";
        sheetname = "FanMats";
        sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname);
        if(tracking_number != "" && order_id != "") {
          
          //----------------------The Output File---------------------//
          // [     1       ][    2            ][   3    ][     4     ][     5    ][    6    ][     7    ][     8     ][    9        ][     10           ]
          // [     A       ][    B            ][   C    ][     D     ][     E    ][    F    ][     G    ][     H     ][    I        ][      j           ]
          //    order_id    | invoice_number   | sku     | quantity  |   tracking | carrier  | ship_date | ship_price | ship_weight | total_product_cost
          sheet.appendRow([order_id, invoice_number, sku, quantity, tracking_number, carrier, ship_date, ship_price, ship_weight, total_product_cost]);
          
          // Move the email from inbox to tracking && mark as read
          message.markRead();
          tracking_label = GmailApp.getUserLabelByName("Tracking");
          tmp_thread = message.getThread();
          tmp_thread.addLabel(tracking_label).moveToArchive();
        }
      } // End if
    } // End else-if    //----------------------End FedEx---------------------//
    else
    {
      // Do nothing
    } 
  } // End for loop
}


// Function: removeDuplicates() Function
// Description: remove duplicate rows from the sheet specified in the parameter
// Preconditions: There must be a sheet to perform this on
// Postcondition: Duplicate rows are removed from a specified sheet
// Big O notation: O(n^2)
/*function removeDuplicates(name) {
  name = name || 0;
  
  var sheetname;
  var data;
  var newData;
  var row;
  var duplicate;
  if(name != 0) {
    sheetname = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  } else {
    sheetname = SpreadsheetApp.getActiveSheet();
  }
  data = sheetname.getDataRange().getValues();
  newData = new Array();
  for(i in data){
    row = data[i];
    duplicate = false;
    for(j in newData){
      if(row.join() == newData[j].join()){
        duplicate = true;
      }
    }
    if(!duplicate){
      newData.push(row);
    }
  }
  sheetname.clearContents();
  sheetname.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
}*/
