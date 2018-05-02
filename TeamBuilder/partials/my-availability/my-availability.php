<?php
	// Allow the config
	define('__CONFIG__', true);
	require_once "../../php/config.php"; 
	
	// Declare the return variable
	$return = [];

	// Get the data package
	$request_package = json_decode(file_get_contents('php://input'));
	
	// Perform the correct action based on the 'Action' parameter
	if ($request_package->{'Action'} === "Get") {
		// Get the fixtures
		$getFixtures = $con->prepare("SELECT * FROM vPickAvailability WHERE Member_UserID = :member_userid");
		$getFixtures->bindParam(':member_userid', $request_package->{'Member_UserID'}, PDO::PARAM_INT);
		$getFixtures->execute();
		$return['data'] = $getFixtures->fetchAll();
	} elseif ($request_package->{'Action'} === "Set") {
		// Insert the players availability
		$setAvailability = $con->prepare("INSERT INTO teamsheet(FixtureID, Squad_UserID, Available) VALUES(:fixtureID, :squad_userid, :available)");
		$setAvailability->bindParam(':fixtureID', $request_package->{'Availability'}->{'FixtureID'}, PDO::PARAM_INT);
		$setAvailability->bindParam(':squad_userid', $request_package->{'Availability'}->{'Squad_UserID'}, PDO::PARAM_INT);
		$setAvailability->bindParam(':available', $request_package->{'Availability'}->{'Available'}, PDO::PARAM_INT);
		$setAvailability->execute();

		//
		$return['message'] = "Availability inserted.";
	} elseif ($request_package->{'Action'} === "Update") {
		// Change the players availability

		$setAvailability = $con->prepare("UPDATE teamsheet SET Available = :available WHERE TeamSheetID = :teamsheetid");
		$setAvailability->bindParam(':available', $request_package->{'Availability'}->{'Available'}, PDO::PARAM_INT);
		$setAvailability->bindParam(':teamsheetid', $request_package->{'Availability'}->{'TeamSheetID'}, PDO::PARAM_INT);
		$setAvailability->execute();

		//
		$return['message'] = "Availability edited.";
	} 
		
//$return['error'] = json_decode($request_body);
echo json_encode($return, JSON_PRETTY_PRINT); exit;
?>