import request from 'supertest';
import app from '../../index.js';
import db from '../../db/dbConfig.js';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

describe('Auth Login', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    await db.query(
      'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)',
      ['test_user_name', 'testLogin@example.com', hashedPassword]
    );
  });

  afterAll(async () => {
    await db.query('DELETE FROM users WHERE email = $1', [
      'testLogin@example.com',
    ]);
    await db.end();
  });

  it('should return a token if the email and password are valid', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'testLogin@example.com',
      password: 'password',
    });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('email', 'testLogin@example.com');
    expect(response.body).toHaveProperty('token');
  });

  it('should return a 400 error if email or password is missing', async () => {
    const response = await request(app).post('/auth/login').send({});

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBe('Please enter all fields');
  });

  it('should return a 404 error if email is not found', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password',
    });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.msg).toBe('Wrong email or password');
  });

  it('should return a 400 error if password is incorrect', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'testLogin@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBe('Wrong email or password');
  });
});
