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
		// Get the users
		$getUsers = $con->prepare("SELECT Email, FirstName, Surname, isAdmin, isArchived, UserId FROM users");
		$getUsers->execute();
		$return['data'] = $getUsers->fetchAll();
	} elseif ($request_package->{'Action'} === "Add") {
		// Add a new user
		$addUser = $con->prepare("INSERT INTO users(FirstName, Surname, Email, Password) VALUES(:firstname, :surname, LOWER(:email), :password)");
		$addUser->bindParam(':firstname', $request_package->{'User'}->{'FirstName'}, PDO::PARAM_STR);
		$addUser->bindParam(':surname', $request_package->{'User'}->{'Surname'}, PDO::PARAM_STR);
		$addUser->bindParam(':email', $request_package->{'User'}->{'Email'}, PDO::PARAM_STR);
		$addUser->bindParam(':password', $request_package->{'User'}->{'Password'}, PDO::PARAM_STR);
		$addUser->execute();

		// Get the id of the last inserted record and return it
		$user_id = $con->lastInsertId();
		$return['data'] = $user_id;
		$return['message'] = "User added.";
	} elseif ($request_package->{'Action'} === "Edit") {
		// Edit an existing user
		$editUser = $con->prepare("UPDATE users SET Email = LOWER(:email), FirstName = :firstname, Surname = :surname, isAdmin = :isadmin, isArchived = :isarchived WHERE userID = :userid");
		$editUser->bindParam(':email', $request_package->{'User'}->{'Email'}, PDO::PARAM_STR);
		$editUser->bindParam(':userid', $request_package->{'User'}->{'UserId'}, PDO::PARAM_INT);
		$editUser->bindParam(':firstname', $request_package->{'User'}->{'FirstName'}, PDO::PARAM_STR);
		$editUser->bindParam(':surname', $request_package->{'User'}->{'Surname'}, PDO::PARAM_STR);
		$editUser->bindParam(':isadmin', $request_package->{'User'}->{'isAdmin'}, PDO::PARAM_INT);
		$editUser->bindParam(':isarchived', $request_package->{'User'}->{'isArchived'}, PDO::PARAM_INT);
		$editUser->execute();

		//
		$return['message'] = "User edited.";
	} elseif ($request_package->{'Action'} === "Delete") {
		// Delete a user
		$deleteUser = $con->prepare("DELETE FROM users WHERE userID = :userID");
		$deleteUser->bindParam(':userID', $request_package->{'UserID'}, PDO::PARAM_INT);
		$deleteUser->execute();
		
		//
		$return['message'] = "User deleted.";
	}
		
echo json_encode($return, JSON_PRETTY_PRINT); exit;
?>