import express from 'express';
import passport from 'passport';
import postController from '../../controller/post'

const router = express.Router()

// @route   GET api/v1/posts/test
// @desc    Test posts endpoint
// @access  Public
router.post('/post', passport.authenticate('jwt', { session: false }), postController.post);
router.delete('/delete/:post_id', passport.authenticate('jwt', {session: false}), postController.delete);
router.get('/posts', passport.authenticate('jwt', { session: false}), postController.getAll);
router.get('/post/:post_id', passport.authenticate('jwt', { session: false}), postController.get);

// likes
router.post('/:post_id/like', passport.authenticate('jwt', { session: false }), postController.likePost);
router.post('/:post_id/unlike', passport.authenticate('jwt', { session: false }), postController.unlikePost);


export default router;
