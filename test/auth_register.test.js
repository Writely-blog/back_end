// import { register, login, getUserNameById } from './authController';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../index.js';
dotenv.config();

describe('Auth Controller', () => {
  describe('register', () => {
    // it('should return a 201 status code and the email and token if the user is successfully registered', async () => {
    //   const res = await request(app).post('/auth/register').send({
    //     user_name: 'testuser1',
    //     email: 'test1@example.com',
    //     password: 'password',
    //     password2: 'password',
    //   });
    //   expect(res.status).toBe(201);
    //   expect(res.body).toHaveProperty('email', 'test1@example.com');
    //   expect(res.body).toHaveProperty('token');
    // });

    it('should return a 400 status code if a required field is missing', async () => {
      const res = await request(app).post('/auth/register').send({
        user_name: 'testuser',
        email: 'test@example.com',
        password: 'password',
      });
      expect(res.status).toBe(400);
    });

    it('should return a 400 status code if the email is not valid', async () => {
      const res = await request(app).post('/auth/register').send({
        user_name: 'testuser',
        email: 'invalidemail',
        password: 'password',
        password2: 'password',
      });
      expect(res.status).toBe(400);
    });

    it('should return a 400 status code if the password is less than 6 characters', async () => {
      const res = await request(app).post('/auth/register').send({
        user_name: 'testuser',
        email: 'test@example.com',
        password: 'pass',
        password2: 'pass',
      });
      expect(res.status).toBe(400);
    });

    it('should return a 400 status code if the passwords do not match', async () => {
      const res = await request(app).post('/auth/register').send({
        user_name: 'testuser',
        email: 'test@example.com',
        password: 'password',
        password2: 'notmatching',
      });
      expect(res.status).toBe(400);
    });

    // it('should return a 409 status code if the email is already registered', async () => {
    //   const res = await request(app).post('/auth/register').send({
    //     user_name: 'testuser',
    //     email: 'test@example.com',
    //     password: 'password',
    //     password2: 'password',
    //   });
    //   const res2 = await request(app).post('/auth/register').send({
    //     user_name: 'testuser',
    //     email: 'test@example.com',
    //     password: 'password',
    //     password2: 'password',
    //   });
    //   expect(res2.status).toBe(409);
    // });
  });
});
