import db from '../db/dbConfig.js';
import CustomAPIError from '../errors/custom-error.js';
import { StatusCodes } from 'http-status-codes';

export const allPosts = async (req, res) => {
  const posts = await db.query('SELECT * FROM posts');

  res.status(StatusCodes.OK).json({ posts: posts.rows });
};
export const createPost = async (req, res) => {
  const { userId } = req;
  const { title, context } = req.body;

  const post = await db.query(
    'INSERT INTO posts (title, context, user_id) VALUES ($1, $2, $3) RETURNING *',
    [title, context, userId]
  );

  res.json({ post: post.rows });
};
export const allMyPosts = async (req, res) => {
  const { userId } = req;

  const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [
    userId,
  ]);

  res.send({ posts: posts.rows });
};
export const onePost = async (req, res) => {
  const { id } = req.params;

  const post = await db.query('SELECT * FROM posts WHERE id = $1', [id]);

  if (post.rowCount === 0) {
    throw new CustomAPIError('Post not found', StatusCodes.NOT_FOUND);
  }

  res.json({ post: post.rows });
};
export const editPost = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const { title, context } = req.body;

  const post = await db.query('SELECT user_id FROM posts WHERE id = $1', [id]);

  console.log(post);

  if (post.rowCount === 0) {
    throw new CustomAPIError('Post not found', StatusCodes.NOT_FOUND);
  }

  // checks if the user is the owner of the post
  if (post.rows[0].user_id !== Number(userId)) {
    throw new CustomAPIError('No access', StatusCodes.FORBIDDEN);
  }

  const updatedPost = await db.query(
    'UPDATE posts SET title = $1, context = $2 WHERE id = $3 RETURNING *',
    [title, context, id]
  );

  res.json({ post: updatedPost.rows });
};
export const deletePost = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;

  const post = await db.query('SELECT user_id FROM posts WHERE id = $1', [id]);

  if (post.rowCount === 0) {
    throw new CustomAPIError('Post not found', StatusCodes.NOT_FOUND);
  }

  // checks if the user is the owner of the post
  if (post.rows[0].user_id !== Number(userId)) {
    throw new CustomAPIError('No access', StatusCodes.FORBIDDEN);
  }

  const deletedPost = await db.query(
    'DELETE FROM posts WHERE id = $1 RETURNING *',
    [id]
  );

  res.json({ post: deletedPost.rows });
};
