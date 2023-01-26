import * as dotenv from 'dotenv';
import db from '../db/dbConfig.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomAPIError from '../errors/custom-error.js';
import { StatusCodes } from 'http-status-codes';
dotenv.config();

const email_re =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const register = async (req, res) => {
  const { user_name, email, password, password2 } = req.body;

  if (!user_name || !email || !password || !password2) {
    throw new CustomAPIError('Plese enter all fields', StatusCodes.BAD_REQUEST);
  }

  if (!email.match(email_re)) {
    throw new CustomAPIError('Not valid email', StatusCodes.BAD_REQUEST);
  }

  if (password.length < 6) {
    throw new CustomAPIError(
      'Password should be at least 6 characters',
      StatusCodes.BAD_REQUEST
    );
  }

  if (password !== password2) {
    throw new CustomAPIError('Passwords do not match', StatusCodes.BAD_REQUEST);
  }

  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  //if user with same email already exists
  if (existingUser.rowCount !== 0) {
    throw new CustomAPIError('Email already registered', StatusCodes.CONFLICT);
  }

  // password hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await db.query(
    'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING id, email',
    [user_name, email, hashedPassword]
  );

  const token = jwt.sign(
    {
      id: user.rows[0].id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(StatusCodes.CREATED).json({ email: user.rows[0].email, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomAPIError(
      'Please enter all fields',
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (user.rowCount === 0) {
    throw new CustomAPIError('Wrong email or password', StatusCodes.NOT_FOUND);
  }

  const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!isValidPassword) {
    throw new CustomAPIError(
      'Wrong email or password',
      StatusCodes.BAD_REQUEST
    );
  }

  const token = jwt.sign(
    {
      id: user.rows[0].id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(StatusCodes.OK).json({ email: user.rows[0].email, token });
};

export const getUserNameById = async (req, res) => {
  const { id } = req.params;

  const user_name = await db.query(
    'SELECT user_name FROM users WHERE id = $1',
    [id]
  );

  if (user_name.rowCount === 0) {
    throw new CustomAPIError('User not found', StatusCodes.NOT_FOUND);
  }

  res.send(user_name.rows[0]);
};

// The register function is used to handle a user registration request. It first checks if all required fields (user_name, email, password, password2) are present in the request body. It then uses the email_re constant, which is a regular expression, to check if the email provided is valid. If the email is not valid, it throws an error. If the email is valid, it continues to check if the password is at least 6 characters long, and if the password and password2 match. If these conditions are met, it checks if the provided email is already registered by querying the database. If the email is not already registered, it proceeds to hash the password and insert the user's information into the database. Once the information is inserted, it creates a JSON Web Token (JWT) and sends it back as a response along with the email.

// The login function is used to handle a user login request. It first checks if both the email and password fields are present in the request body. It then queries the database to check if the provided email is registered. If the email is not registered, it throws an error. If the email is registered, it compares the provided password with the hashed password stored in the database. If the passwords match, it creates a JWT and sends it back as a response along with the email.

// The getUserNameById function is used to handle a request to get a user's name based on their id. It first gets the id from the request parameters, then it queries the database to get the user's name based on that id. If no user is found with the provided id, it throws an error. If the user is found, it sends the user's name as a response.
