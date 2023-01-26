import request from 'supertest';
import app from '../../index.js';
import db from '../../db/dbConfig';
import { StatusCodes } from 'http-status-codes';

describe('getUserNameById', () => {
  // beforeAll(async () => {
  //   const hashedPassword = await bcrypt.hash('password', 10);
  //   await db.query(
  //     'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)',
  //     ['test_user', 'test@example.com', hashedPassword]
  //   );
  // });

  // afterAll(async () => {
  //   await db.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
  //   await db.end();
  // });

  it('should return a user_name if the id is valid', async () => {
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [
      'test@example.com',
    ]);

    const response = await request(app).get('/auth/user/' + rows[0].id);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('user_name');
    expect(response.body.user_name).toBe('test_user_name');
  });

  it('should return a 404 error if id is not found', async () => {
    const response = await request(app).get('/auth/user/0');

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.msg).toBe('User not found');
  });
});
