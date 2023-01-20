import { Router } from 'express';

import {
  allPosts,
  createPost,
  allMyPosts,
  onePost,
  editPost,
  deletePost,
} from '../controllers/posts.controllers.js';

const router = Router();

router.route('/').get(allPosts).post(createPost);

router.route('/mine').get(allMyPosts);

router.route('/:id').get(onePost).patch(editPost).delete(deletePost);

export default router;
