function parseEmailsWithTracking(start) {

  start = start || 0;

  var threads = GmailApp.getInboxThreads(start, 500);
  
  for (var i = 0; i < threads.length; i++) {

    var message = threads[i].getMessages()[0];
    var sender = message.getFrom();
    var subject = message.getSubject();
    var content = message.getPlainBody();
    var test;
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
    if (/*sender.match(/.trackingupdates@fedex.com./) &&*/ subject.match(/.*FedEx.* Notification.*/) && !content.match(/.*SPORTS LICENSING.*/)) {
        if (content && sender && subject) {
          test = content.match(/Purchase order number:\s+(\d+)(\r?\n)/);
          if(test && test[1]) {
            //----Column 1: order_id (distributor order id)
            tmp = content.match(/Purchase order number:\s+(\d+)(\r?\n)/);
            order_id = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 2: invoice_number (reference number)
            tmp = content.match(/Reference:\s+(\d+)(\r?\n)/);
            invoice_number = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 4: quantity (Number of pieces)
            tmp = content.match(/Number of pieces:\s+(\d+)(\r?\n)/);
            quantity = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 5: tracking_number
            tmp = content.match(/Tracking number:\s+(\d+)/);
            tracking_number = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 9: ship_weight
            tmp = content.match(/Weight:\s+([0-9]+\.[0-9]+)\s+.*(\r?\n)/);
            //tmp = content.match(/Weight:\s+([0-9\.]+)\s+([a-zA-Z\.]+)\s+(\r?\n)/);
            ship_weight = (tmp && tmp[1]) ? tmp[1] : "";
          } else { //------------THE FORMAT IS DIFFERENT-------------//
            //----Column 1: order_id (distributor order id)
            tmp = content.match(/Purchase order number:\*\s+(\d+)/);
            order_id = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 2: invoice_number (reference number)
            tmp = content.match(/Reference:\*\s+(\d+)/);
            invoice_number = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 4: quantity (Number of pieces)
            tmp = content.match(/Number of pieces:\*\s+(\d+)/);
            quantity = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 5: tracking_number
            tmp = content.match(/Tracking number:\*\s+(\d+)/);
            tracking_number = (tmp && tmp[1]) ? tmp[1].trim() : "";
            //----Column 9: ship_weight
            tmp = content.match(/Weight:\*\s+([0-9]+\.[0-9]+)\s+.*/);
            //tmp = content.match(/Weight:\s+([0-9\.]+)\s+([a-zA-Z\.]+)\s+(\r?\n)/);
            ship_weight = (tmp && tmp[1]) ? tmp[1] : "";
          }
          if(tracking_number != "" && order_id != "") {
            
            //----Column 3: sku
            sku = "";
            //----Column 6: carrier
            carrier = "FedEx";
            //----Column 7: ship_date
            ship_date = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd");
            //----Column 8: ship_price
            ship_price = "";
            //----Column 10: total_product_cost
            total_product_cost = "";
            //----Set the Sheet Name to "Northwest_S"      
            sheetname = "Northwest_S";
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
            removeDuplicates(sheetname);
          }
      }
    }
    
    //-------------------FedEx Emails Continued-------------------//
    else if(/*sender.match(/.trackingupdates@fedex.com./) &&*/ subject.match(/.*FedEx.* Notification.*/) && content.match(/.*SPORTS LICENSING.*/)) {
      Logger.log(content);
      if (content && sender && subject) {
        //----Column 1: order_id (distributor order id)
        tmp = content.match(/Purchase order number:\*\s+(\d+)/);
        if(tmp && tmp[1]) {
          order_id = tmp[1].trim();
        } else {
          tmp = content.match(/Purchase order number:\*\s+(\d+)(\r?\n)/);
          order_id = tmp[1].trim();
        }
        //order_id = (tmp && tmp[1]) ? tmp[1].trim() : "";
        //----Column 2: invoice_number (reference number)
        tmp = content.match(/Invoice number:\*\s+(\d+)/);
        //invoice_number = (tmp && tmp[1]) ? tmp[1].trim() : "";
        if(tmp && tmp[1]) {
          invoice_number = tmp[1].trim();
        } else {
          tmp = content.match(/Invoice number:\*\s+(\d+)(\r?\n)/);
          invoice_number = tmp[1].trim();
        }
        //----Column 4: quantity (Number of pieces)
        tmp = content.match(/Number of pieces:\*\s+(\d+)/);
        if(tmp && tmp[1]) {
          quantity = tmp[1].trim();
        } else {
          tmp = content.match(/Number of pieces:\*\s+(\d+)(\r?\n)/);
          quantity = tmp[1].trim();
        }
        //----Column 5: tracking_number
        tmp = content.match(/Tracking number:\*\s+(\d+)/);
        if(tmp && tmp[1]) {
          tracking_number = tmp[1].trim();
        } else {
          tmp = content.match(/Tracking number:\*\s+(\d+)(\r?\n)/);
          tracking_number = tmp[1].trim();
        }
        //----Column 9: ship_weight
        tmp = content.match(/Weight:\*\s+([0-9]+\.[0-9]+)\s+.*/);
        //ship_weight = (tmp && tmp[1]) ? tmp[1] : "";
        if(tmp && tmp[1]) {
          ship_weight = tmp[1].trim();
        } else {
          tmp = content.match(/Weight:\*\s+([0-9]+\.[0-9]+)\s+.*(\r?\n)/);
          ship_weight = tmp[1].trim();
        }

        //-----------------Simple Section----------------//
        //----Column 3: sku
        sku = "";
        //----Column 6: carrier
        carrier = "FedEx";
        //----Column 7: ship_date
        ship_date = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd");
        //----Column 8: ship_price
        ship_price = "";
        //----Column 10: total_product_cost
        total_product_cost = "";
        //----Set the Sheet Name to "FanMats_S"
        sheetname = "FanMats_S";
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
          removeDuplicates(sheetname);
        }
      } // End if
    } // End else-if    //----------------------End FedEx---------------------//
    else
    {
      // Do nothing
    } 
  } // End for loop
}

function removeDuplicates(name) {
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
}
