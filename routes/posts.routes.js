import { Router } from 'express';

import {
  allPosts,
  createPost,
  allMyPosts,
  onePost,
  editPost,
  deletePost,
} from '../controllers/posts.controllers.js';

const authPostRouter = Router();

authPostRouter.route('/').post(createPost);

authPostRouter.route('/mine').get(allMyPosts);

authPostRouter.route('/:id').get(onePost).put(editPost).delete(deletePost);

const postRouter = Router();

postRouter.route('/').get(allPosts);

export { authPostRouter, postRouter };
