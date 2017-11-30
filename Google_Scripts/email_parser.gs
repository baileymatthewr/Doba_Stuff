
function parseEmailsWithTracking(start) {

  start = start || 0;

  var threads = GmailApp.getInboxThreads(start, 500);
  var sheet = SpreadsheetApp.getActiveSheet();

  for (var i = 0; i < threads.length; i++) {

    var tmp;
    var message = threads[i].getMessages()[0];
    var sender = message.getFrom();
    var subject = message.getSubject();
    var content = message.getPlainBody();
   
    //------------------FedEx Emails------------------//
    if (/*sender.match(/.fulfillment@doba.com./) &&*/ subject.match(/.*FedEx.* Notification.*/)) {
      // Implement Parsing rules using regular expressions
      if (content && sender && subject) {
        //----Column 1: order_id (distributor order id)
        tmp = content.match(/Purchase order number:\s+(\d+)(\r?\n)/);
        var order_id = (tmp && tmp[1]) ? tmp[1].trim() : "";
        //----Column 2: invoice_number (reference number)
        tmp = content.match(/Reference:\s+(\d+)(\r?\n)/);
        var invoice_number = (tmp && tmp[1]) ? tmp[1].trim() : "";
        //----Column 3: sku
        var sku = "";
        //----Column 4: quantity (Number of pieces)
        tmp = content.match(/Number of pieces:\s+(\d+)(\r?\n)/);
        var quantity = (tmp && tmp[1]) ? tmp[1].trim() : "";
        //----Column 5: tracking_number
        tmp = content.match(/Tracking number:\s+(\d+)(\r?\n)/);
        var tracking_number = (tmp && tmp[1]) ? tmp[1].trim() : "";
        //----Column 6: carrier
        var carrier = "FedEx";
        //----Column 7: ship_date
        var ship_date = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy");
        //----Column 8: ship_price
        var ship_price = "";
        //----Column 9: ship_weight
        tmp = content.match(/Weight:\s+(.+)(\r?\n)/);
        var ship_weight = (tmp && tmp[1]) ? tmp[1].trim() : "";
        //----Column 10: total_product_cost
        var total_product_cost = "";
        
        
        
        //leftovers
        tmp = content.match(/Service type:\s+([A-Za-z0-9]+\s{1}[A-Za-z0-9]+)(\r?\n)/);
        var service = (tmp && tmp[1]) ? tmp[1].trim() : "None";
        //----Column ?: From
        tmp = sender.match(/([A-Za-z0-9]+@{1}[A-Za-z0-9]+\.[A-Za-z0-9]+)/);
        sender = (tmp && tmp[0]) ? tmp[0].trim() : "None";
        //----Column ?: Subject 
        // subject is still the subject
        //----Column ?: Message
        tmp = content.toString().replace(/\s/g, " ");
        var body = tmp;
        
        // [     1       ][    2            ][   3    ][     4     ][     5    ][    6    ][     7    ][     8     ][    9        ][     10           ]
        // [     A       ][    B            ][   C    ][     D     ][     E    ][    F    ][     G    ][     H     ][    I        ][      j           ]
        //    order_id    | tracking         | weight  | reference |   carrier  | service  |   from    |  subject   |    body     |    N/A            |
        //    order_id    | invoice_number   | sku     | quantity  |   tracking | carrier  | ship_date | ship_price | ship_weight | total_product_cost
        //sheet.appendRow([order_id, tracking, weight, reference, carrier, service, sender, subject, body]);
        sheet.appendRow([order_id, invoice_number, sku, quantity, tracking_number, carrier, ship_date, ship_price, ship_weight, total_product_cost]);
        // Move the email from inbox to tracking && mark as read
        
      }
    } //---------------------End FedEx Emails---------------------//
  } // End for loop
}
