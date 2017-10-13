<?php
$api_url = "https://sandbox.doba.com/api/20110301/xml_retailer_api.php";
$api_username = "username";
$api_password = "password";
$api_retailer_id = "5089840";
$strRequest = "
<dce>
    <request>
        <authentication>
            <username>". $api_username ."</username>
            <password>". $api_password ."</password>
        </authentication>		
        <retailer_id>". $api_retailer_id ."</retailer_id>
    <action>orderLookup</action>
    <shipping_street>3401 N Thanksgiving Way</shipping_street>
    <shipping_city>Lehi</shipping_city>
    <shipping_state>UT</shipping_state>
    <shipping_postal>84043</shipping_postal>
    <shipping_country>US</shipping_country>
    <items>
      <item>
        <item_id>26256475</item_id>
        <quantity>2</quantity>
      </item>
      <item>
      	<item_id>21746</item_id>
        <quantity>3</quantity>
      </item>
      <item>
      	<item_id>27584873</item_id>
        <quantity>1</quantity>
      </item>      
    </items>
  </request>
</dce>
";
$connection = curl_init();
curl_setopt($connection, CURLOPT_URL, $api_url );
curl_setopt($connection, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($connection, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($connection, CURLOPT_POST, 1);
curl_setopt($connection, CURLOPT_POSTFIELDS, $strRequest);
curl_setopt($connection, CURLOPT_RETURNTRANSFER, 1);
set_time_limit(108000);
$strResponse = curl_exec($connection);
if(curl_errno($connection)) {
	print "Curl error: " . curl_error($connection);
} else {
	$info = curl_getinfo($connection);
	print "HTTP Response Code = ".$info["http_code"]."\n";
}
curl_close($connection);

print "URL = $api_url\n\n";
print "Method = orderLookup\n\n";
print "Request:\n=====================================================\n\n";
print_r($strRequest);
print "\n\nResponse:\n=====================================================\n\n";
print_r($strResponse);
?>