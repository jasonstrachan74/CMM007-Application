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
		// Get the fixture list for the team
		$getFixtures = $con->prepare("SELECT * FROM vFixtureList WHERE TeamID = :teamID");
		$getFixtures->bindParam(':teamID', $request_package->{'TeamID'}, PDO::PARAM_INT);
		$getFixtures->execute();
		$return['data'] = $getFixtures->fetchAll();
	} elseif ($request_package->{'Action'} === "Pick") {
		// Get the fixture list for the team
		$getFixturePlayers = $con->prepare("SELECT * FROM vSquadChoice WHERE Available = 1 AND FixtureID = :fixtureid");
		$getFixturePlayers->bindParam(':fixtureid', $request_package->{'FixtureID'}, PDO::PARAM_INT);
		$getFixturePlayers->execute();
		$return['data'] = $getFixturePlayers->fetchAll();
	} elseif ($request_package->{'Action'} === "PickPlayer") {
		// Edit a player for the team
		$editPlayer = $con->prepare("UPDATE teamsheet SET Picked = :picked WHERE TeamSheetID = :teamsheetID");
		$editPlayer->bindParam(':teamsheetID', $request_package->{'TeamSheetID'}, PDO::PARAM_INT);
		$editPlayer->bindParam(':picked', $request_package->{'Picked'}, PDO::PARAM_INT);
		$editPlayer->execute();
		
		//
		$return['message'] = "Player picked.";
	}elseif ($request_package->{'Action'} === "Add") {
		// Add a new Fixture
		$addFixture = $con->prepare("INSERT INTO fixturelists(TeamID, Opponent, Location, Date) VALUES(:teamid, :opponent, :location, :date)");
		$addFixture->bindParam(':teamid', $request_package->{'Fixture'}->{'TeamID'}, PDO::PARAM_INT);
		$addFixture->bindParam(':opponent', $request_package->{'Fixture'}->{'Opponent'}, PDO::PARAM_STR);
		$addFixture->bindParam(':location', $request_package->{'Fixture'}->{'Location'}, PDO::PARAM_STR);
		$addFixture->bindParam(':date', $request_package->{'Fixture'}->{'Date'}, PDO::PARAM_STR);
		$addFixture->execute();

		// Get the id of the last inserted record and return it
		$fixture_id = $con->lastInsertId();
		$return['data'] = $fixture_id;
		$return['message'] = "Fixture added.";
	} elseif ($request_package->{'Action'} === "Edit") {
		// Edit an existing fixture
		$editFixture = $con->prepare("UPDATE fixturelists SET Opponent = :opponent, Location = :location, Date = :date WHERE FixtureID = :fixtureid");
		$editFixture->bindParam(':fixtureid', $request_package->{'Fixture'}->{'FixtureID'}, PDO::PARAM_INT);
		$editFixture->bindParam(':opponent', $request_package->{'Fixture'}->{'Opponent'}, PDO::PARAM_STR);
		$editFixture->bindParam(':location', $request_package->{'Fixture'}->{'Location'}, PDO::PARAM_STR);
		$editFixture->bindParam(':date', $request_package->{'Fixture'}->{'Date'}, PDO::PARAM_STR);
		$editFixture->execute();
		
		//
		$return['message'] = "Fixture edited.";
	} elseif ($request_package->{'Action'} === "Delete") {
		// Delete a fixture and teamsheet details
		$deleteTeamSheet = $con->prepare("DELETE FROM teamsheet WHERE FixtureID = :fixtureid");
		$deleteTeamSheet->bindParam(':fixtureid', $request_package->{'FixtureID'}, PDO::PARAM_INT);
		$deleteTeamSheet->execute();
		$deleteFixture = $con->prepare("DELETE FROM fixturelists WHERE FixtureID = :fixtureid");
		$deleteFixture->bindParam(':fixtureid', $request_package->{'FixtureID'}, PDO::PARAM_INT);
		$deleteFixture->execute();
		
		//
		$return['message'] = "Fixture deleted.";
	}
		
//$return['error'] = json_decode($request_body);
echo json_encode($return, JSON_PRETTY_PRINT); exit;
?>