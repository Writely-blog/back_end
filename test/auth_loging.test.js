import request from 'supertest';
import app from '../index.js';
import db from '../db/dbConfig.js';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

describe('Login', () => {
  beforeEach(async () => {
    await db.query('TRUNCATE TABLE users CASCADE');
  });

  afterAll(async () => {
    await db.query('TRUNCATE TABLE users CASCADE');
    await db.end();
  });

  it('should return a token if the email and password are valid', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    await db.query(
      'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)',
      ['test_user_name', 'test@example.com', hashedPassword]
    );

    const response = await request(app).post('/auth/login').send({
      user_name: 'test_user_name',
      email: 'test@example.com',
      password: 'password',
    });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('token');
  });

  it('should return a 400 error if email or password is missing', async () => {
    const response = await request(app).post('/auth/login').send({});

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBe('Please enter all fields');
  });

  it('should return a 404 error if email is not found', async () => {
    const response = await request(app).post('/auth/login').send({
      user_name: 'test_user_name',
      email: 'nonexistent@example.com',
      password: 'password',
    });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.msg).toBe('Wrong email or password');
  });

  it('should return a 400 error if password is incorrect', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    await db.query(
      'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)',
      ['test_user_name', 'test@example.com', hashedPassword]
    );

    const response = await request(app).post('/auth/login').send({
      user_name: 'test_user_name',
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBe('Wrong email or password');
  });
});
