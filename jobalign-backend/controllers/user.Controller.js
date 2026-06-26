// controllers/user.Controller.js

// Import service functions for user operations from the service layer.
// These functions interact with the MongoDB-based User model.
import { findUserById, updateUserDetails, deleteUserAccount } from '../services/userService.js';

/**
 * getUserDetails
 * -------------------
 * Description: Retrieves detailed information for a specific user by their ID.
 * Frontend Usage: Called when a user visits their profile page to display their account details.
 * 
 * Process:
 *  - Extracts the 'userId' from the request URL parameters.
 *  - Calls the 'findUserById' service function to fetch user data.
 *  - Sends back the user details in a JSON response with a 200 status.
 *  - If an error occurs, logs the error and sends a 500 error response.
 */
export const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await findUserById(userId);
    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user details:', err);
    return res.status(500).json({ message: 'Error fetching user details', error: err.message });
  }
};

/**
 * updateUser
 * -------------------
 * Description: Updates the information for a specific user.
 * Frontend Usage: Called from the profile edit page when a user updates their personal details.
 * 
 * Process:
 *  - Extracts 'userId' from the request URL parameters.
 *  - Retrieves the updated data from the request body.
 *  - Calls 'updateUserDetails' to update the user record in the database.
 *  - Returns a success message along with the updated user details.
 *  - Handles and logs any errors, returning a 500 error response if necessary.
 */
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  try {
    const updatedUser = await updateUserDetails(userId, updatedData);
    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

/**
 * deleteUser
 * -------------------
 * Description: Deletes a specific user account from the system.
 * Frontend Usage: Called from account settings when a user chooses to delete their account.
 * 
 * Process:
 *  - Extracts 'userId' from the request URL parameters.
 *  - Calls 'deleteUserAccount' to remove the user from the database.
 *  - Returns the deletion result in a JSON response with a 200 status.
 *  - Logs and handles any errors by sending a 500 error response.
 */
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await deleteUserAccount(userId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
