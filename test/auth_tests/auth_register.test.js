// import { register, login, getUserNameById } from './authController';
import dotenv from 'dotenv';
import request from 'supertest';
import db from '../../db/dbConfig.js';
import app from '../../index.js';
dotenv.config();

describe('Auth Register', () => {
  afterAll(async () => {
    await db.query('DELETE FROM users WHERE email = $1', [
      'testRegister@example.com',
    ]);
    await db.end();
  });

  it('should return a 201 status code and the email and token if the user is successfully registered', async () => {
    const response = await request(app).post('/auth/register').send({
      user_name: 'testuser',
      email: 'testRegister@example.com',
      password: 'password',
      password2: 'password',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('email', 'testRegister@example.com');
    expect(response.body).toHaveProperty('token');
  });

  it('should return a 400 status code if a required field is missing', async () => {
    const response = await request(app).post('/auth/register').send({
      user_name: 'testuser',
      email: 'testRegister@example.com',
      password: 'password',
    });
    expect(response.status).toBe(400);
  });

  it('should return a 400 status code if the email is not valid', async () => {
    const response = await request(app).post('/auth/register').send({
      user_name: 'testuser',
      email: 'invalidemail',
      password: 'password',
      password2: 'password',
    });
    expect(response.status).toBe(400);
  });

  it('should return a 400 status code if the password is less than 6 characters', async () => {
    const response = await request(app).post('/auth/register').send({
      user_name: 'testuser',
      email: 'testRegister@example.com',
      password: 'pass',
      password2: 'pass',
    });
    expect(response.status).toBe(400);
  });

  it('should return a 400 status code if the passwords do not match', async () => {
    const response = await request(app).post('/auth/register').send({
      user_name: 'testuser',
      email: 'testRegister@example.com',
      password: 'password',
      password2: 'notmatching',
    });
    expect(response.status).toBe(400);
  });

  it('should return a 409 status code if the email is already registered', async () => {
    const response = await request(app).post('/auth/register').send({
      user_name: 'testuser',
      email: 'testRegister@example.com',
      password: 'password',
      password2: 'password',
    });
    expect(response.status).toBe(409);
  });
});
