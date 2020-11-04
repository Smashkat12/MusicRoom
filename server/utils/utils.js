const { check } = require("express-validator");


/* ****************************************************END OF INPORT **************************************************** */

//Export
export const generateServerError = (
  fullError,
  message,
  location = "server"
) => {
  const errors = {};
  errors[location] = {
    fullError,
    message,
  };
  return errors;
};



/* ****************************************************INPUT VALIDATION **************************************************** */

//validation

export const registerValidation = [
  check("firstname").exists().withMessage("Firstname cannot be empty"), //min len 2
  check("lastname").exists().withMessage("Lastname cannot be empty"),
  check("username").exists().withMessage("Username cannot be empty"), //min len 2
  check("email")
    .exists()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("recheck provided email, there is something not ok with it"),
  check("password") //uppercase, special char,
    .exists()
    .withMessage("password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("password cannot be less than 4 characters"),
];

export const playlistTitleValidation = [
	check("title").exists().withMessage("Playlist tiltle cannot be empty")
];


export const loginValidation = [
  check("username")
    .exists()
    .withMessage("Username cannot be empty"),
  check("password").exists().withMessage("Password cannot be empty"),
];
