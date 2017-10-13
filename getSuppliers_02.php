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
        <action>getSuppliers</action>
        	<supplier_ids>
        		<supplier_id>4</supplier_id>
        	</supplier_ids>
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
    print 'Curl error: ' . curl_error($connection);
} 
curl_close($connection);

print "URL = $api_url\n\n";
print "Method = getSuppliers\n\n";
print "Request:\n=====================================================\n\n";
print_r($strRequest);
print "\n\nResponse:\n=====================================================\n\n";
print_r($strResponse);
?>