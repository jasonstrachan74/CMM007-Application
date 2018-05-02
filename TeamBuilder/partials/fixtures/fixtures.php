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
		// Get the fixture list
		$getTeams = $con->prepare("SELECT * FROM vFixtureList");
		$getTeams->execute();
		$return['data'] = $getTeams->fetchAll();
	} elseif ($request_package->{'Action'} === "GetPlayers") {
		// Get all players on the selected fixture
		$getPlayers = $con->prepare("SELECT * FROM vFixturePlayers WHERE FixtureID = :fixtureID AND Picked = 1");
		$getPlayers->bindParam(':fixtureID', $request_package->{'FixtureID'}, PDO::PARAM_INT);
		$getPlayers->execute();
		$return['data'] = $getPlayers->fetchAll();
	}
		
	// Return the data to the submitting page
	echo json_encode($return, JSON_PRETTY_PRINT); exit;
?>