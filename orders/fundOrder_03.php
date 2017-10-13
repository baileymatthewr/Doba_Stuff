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
		<action>fundOrder</action>
		<fund_method>new_payment_info</fund_method>
		<cvv2>123</cvv2>
		<credit_card_number>12345678910111213</credit_card_number>
		<credit_card_exp_month>01</credit_card_exp_month>
		<credit_card_exp_year>2020</credit_card_exp_year>
		<billing_firstname>Joe</billing_firstname>
		<billing_lastname>Schmoe</billing_lastname>
		<billing_street>3401 N Thanksgiving Way Ste 150</billing_street>
		<billing_city>Lehi</billing_city>
		<billing_state>UT</billing_state>
		<billing_postal>84043</billing_postal>
		<billing_country>US</billing_country>
		<billing_phone>801-765-6000</billing_phone
		<order_ids>
			<order_id>1216623</order_id>
			<order_id>1211924</order_id>
			<order_id>1189369</order_id>
			<order_id>1186791</order_id>
		</order_ids>
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
print "Method = fundOrder\n\n";
print "Request:\n=====================================================\n\n";
print_r($strRequest);
print "\n\nResponse:\n=====================================================\n\n";
print_r($strResponse);
?>