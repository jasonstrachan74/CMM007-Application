<?php
	// Allow the config
	define('__CONFIG__', true);
	require_once "../../php/config.php"; 
	
	// Declare the return variable
	$return = [];

	// Get the data package
	$request_package = json_decode(file_get_contents('php://input'));
	
	// Perform the correct action based on the 'Action' parameter
	if ($request_package->{'Action'} === "Login") {
		// Login the user
		$findUser = $con->prepare("SELECT UserID, FirstName,Surname, Password, isAdmin, isArchived FROM users WHERE email = LOWER(:email) LIMIT 1");
		$findUser->bindParam(':email', $request_package->{'User'}->{'Email'}, PDO::PARAM_STR);
		$findUser->execute();

		if($findUser->rowCount() == 1) {
			// User exists, try and sign them in
			$User = $findUser->fetch(PDO::FETCH_ASSOC);

			$findTeam = $con->prepare("SELECT TeamID FROM teams WHERE Manager_UserID = :userid LIMIT 1");
			$findTeam->bindParam(':userid', $User['UserID'], PDO::PARAM_INT);
			$findTeam->execute();

			// If user is a team manager
			if($findTeam->rowCount() == 1) {
				$return['team'] = $findTeam->fetch(PDO::FETCH_ASSOC);
			}

			$user_id = (int) $User['UserID'];
			$display_name = (string) $User['FirstName'];
			$hash = (string) $User['Password'];
			$is_admin = (bool) $User['isAdmin'];

			if(password_verify($request_package->{'User'}->{'Password'}, $hash)) {
				// User is signed in
				$_SESSION['user_id'] = $user_id;
				$_SESSION['display_name'] = $display_name;
				$_SESSION['is_admin'] = $is_admin;

				$return['data'] = $User;
			} else {
				// Invalid user email/password combo
				$return['error'] = "Invalid user email/password combo";
			}
		} else {
			// They need to create a new account
			$return['error'] = "You do not have an account. Click below to register";
		}
	}
		
echo json_encode($return, JSON_PRETTY_PRINT); exit;
?>