<?php
	// Allow the config
	define('__CONFIG__', true);

	require_once "../../php/config.php"; 
	
	
	$return = [];

	$request_package = json_decode(file_get_contents('php://input'));
	
	if ($request_package->{'Action'} === "Get") {
		// Make sure the user does not exist. 
		$getSquads = $con->prepare("SELECT * FROM vUserSquads WHERE Member_UserID = :userID");
		$getSquads->bindParam(':userID', $request_package->{'UserID'}, PDO::PARAM_INT);
		$getSquads->execute();
		$return['data'] = $getSquads->fetchAll();
	} elseif ($request_package->{'Action'} === "GetAllSquads") {
		// Make sure the user does not exist. 
		$getAllSquads = $con->prepare("SELECT TeamID, Name FROM teams");
		$getAllSquads->execute();
		$return['data'] = $getAllSquads->fetchAll();
	} elseif ($request_package->{'Action'} === "Join") {
		//
		$joinSquad = $con->prepare("INSERT INTO squadmembers(TeamID, Member_UserID) VALUES(:teamID, :member_userid)");
		$joinSquad->bindParam(':teamID', $request_package->{'TeamID'}, PDO::PARAM_INT);
		$joinSquad->bindParam(':member_userid', $request_package->{'Member_UserID'}, PDO::PARAM_INT);
		$joinSquad->execute();


		$user_id = $con->lastInsertId();
		$return['data'] = $user_id;
	} elseif ($request_package->{'Action'} === "Leave") {
		//
		$leaveSquad = $con->prepare("DELETE FROM squadmembers WHERE SquadMemberID = :squadmemberID");
		$leaveSquad->bindParam(':squadmemberID', $request_package->{'SquadMemberID'}, PDO::PARAM_INT);
		$leaveSquad->execute();
		

		
		$return['data'] = "deleted";
	}
		
//$return['error'] = json_decode($request_body);
echo json_encode($return, JSON_PRETTY_PRINT); exit;
?>