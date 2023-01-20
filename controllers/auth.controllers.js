import db from '../db/dbConfig.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomAPIError from '../errors/custom-error.js';
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
  const { user_name, email, password, password2 } = req.body;

  if (!user_name || !email || !password || !password2) {
    throw new CustomAPIError('Plese enter all fields', StatusCodes.BAD_REQUEST);
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
    'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING email',
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
    throw new CustomAPIError('Plese enter all fields', StatusCodes.BAD_REQUEST);
  }

  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (user.rowCount === 0) {
    throw new CustomAPIError('User not found', StatusCodes.NOT_FOUND);
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
