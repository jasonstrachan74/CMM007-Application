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
		// Get the teams
		$getTeams = $con->prepare("SELECT * FROM vTeamWithManager");
		$getTeams->execute();
		$return['data'] = $getTeams->fetchAll();
	} elseif ($request_package->{'Action'} === "GetAllManagers") {
		// Get all managers
		$getAllManagers = $con->prepare("SELECT UserID, FirstName, Surname FROM users");
		$getAllManagers->execute();
		$return['data'] = $getAllManagers->fetchAll();
	} elseif ($request_package->{'Action'} === "Add") {
		// Add a new team
		$addTeam = $con->prepare("INSERT INTO teams(Name, Sport, Manager_UserID) VALUES(:name, :sport,  :manager_userid)");
		$addTeam->bindParam(':name', $request_package->{'Team'}->{'Name'}, PDO::PARAM_STR);
		$addTeam->bindParam(':sport', $request_package->{'Team'}->{'Sport'}, PDO::PARAM_STR);
		$addTeam->bindParam(':manager_userid', $request_package->{'Team'}->{'Manager_UserID'}, PDO::PARAM_INT);
		$addTeam->execute();

		// Get the id of the last inserted record and return it
		$team_id = $con->lastInsertId();
		$return['data'] = $team_id;
		$return['message'] = "Team added.";
	} elseif ($request_package->{'Action'} === "Edit") {
		// Edit an existing team
		$editTeam = $con->prepare("UPDATE teams SET Name = :name, Sport = :sport, Manager_UserID = :manager_userid WHERE TeamID = :teamid");
		$editTeam->bindParam(':name', $request_package->{'Team'}->{'Name'}, PDO::PARAM_STR);
		$editTeam->bindParam(':sport', $request_package->{'Team'}->{'Sport'}, PDO::PARAM_STR);
		$editTeam->bindParam(':manager_userid', $request_package->{'Team'}->{'Manager_UserID'}, PDO::PARAM_INT);
		$editTeam->bindParam(':teamid', $request_package->{'Team'}->{'TeamID'}, PDO::PARAM_INT);
		$editTeam->execute();

		//
		$return['message'] = "Team edited.";
	} elseif ($request_package->{'Action'} === "Delete") {
		// Delete a team
		$deleteTeam = $con->prepare("DELETE FROM teams WHERE teamID = :teamID");
		$deleteTeam->bindParam(':teamID', $request_package->{'TeamID'}, PDO::PARAM_INT);
		$deleteTeam->execute();		

		//
		$return['message'] = "Team deleted.";
	}
		
echo json_encode($return, JSON_PRETTY_PRINT); exit;
?>