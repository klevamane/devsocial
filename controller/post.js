import passport from 'passport';
import mongoose from 'mongoose';

// models
import Post from '../models/post';
import User from '../models/user';

// validators
import validatePost from '../validators/post';

class PostController {

    static post(req, res) {

        let { errors, isValid } = validatePost(req.body);

        if (!isValid)
            return res.status(400).json(errors);
        // validate post here
        
        const newPost = new Post ({
            text: req.body.text,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            avatar: req.body.avatar,
            user: req.user.id
        });
        newPost.save()
            .then(post => res.status(200).json(post))
            .catch(err => res.status(400).json(err));
    }

    static delete(req, res) {
        let idOfPostToBeDeleted = req.params.post_id;
        
        // Post.deleteOne({ id: idOfPostToBeDeleted})

        Post.findById({_id: idOfPostToBeDeleted})
            .then(post => {
                if (post) {
                    if (post.user.toString() !== req.user.id)
                        return res.status(400).json({ post: 'You cannot delete a post created by another user' });
                }

                Post.findOneAndDelete({ _id: idOfPostToBeDeleted})
                .then(post => {
                    if(!post)
                        return res.status(400).json({ post: 'The post was not found' });
                    return res.status(200).json({ delete: 'true', post })
                })
                .catch(err => res.status(400).json({ post: 'The post could not be deleted'}));
            })
            .catch(err => res.status(400).json({ post: 'The post could not be deleted'}));
            // remember the _id not id
       
    }

    static getAll(req, res) {
        Post.find({ user: req.user.id})
            .then(posts => {
                if(posts.length === 0) {
                    return res.status(404).json({ posts: 'No posts found'});
                }
                return res.status(200).json(posts);
            })
    }

    static get(req, res) {
        
        Post.findOne({ _id: req.params.post_id})
        .populate('user', ['firstname', 'lastname', 'avatar'])
            .then(post => {
                if(!post) {
                    return res.status(404).json({ post: 'Post not found'});
                }
                return res.status(200).json(post);
            })
            .catch(err => res.status(404).json({post: 'Invalid post Id'}));
    }

    static likePost(req, res) {
        Post.findOne({ _id: req.params.post_id})
        .then(post => {
            if(!post) {
                return res.status(404).json({ post: 'Post not found'});
            }
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
                return res.status(400).json({ like: 'You have already liked this post'})
            
            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.status(200).json(post));
        })
        .catch(err => res.status(404).json(err));
    }

    static unlikePost(req, res) {
        Post.findOne({ _id: req.params.post_id})
        .then(post => {
            if(!post) {
                return res.status(404).json({ post: 'Post not found'});
            }
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
                return res.status(400).json({ like: 'You have not yet liked this post'});
            
            let indexOfPostToBeUnliked = post.likes
                .map(item => item.user)
                .indexOf(req.user.id);
            
            // Splice out
            post.likes.splice(indexOfPostToBeUnliked, 1); 
            post.save().then(post => res.status(200).json(post));
        })
        .catch(err => res.status(404).json(err));
    }

    static addComment(req, res) {

        let { errors, isValid } = validatePost(req.body);

        if (!isValid)
            return res.status(400).json(errors);

        Post.findById(req.params.post_id)
            .then(post => {

                const newComment = {
                    name: req.body.name,
                    text: req.body.text,
                    user: req.user.id,
                    avatar: req.body.avatar
                }
                // Add the comment to the comments array in the post Model
                post.comments.unshift(newComment);
                post.save().then(post => res.status(200).json(post));
            })
            .catch(err => res.status(404).json({ post: 'The post was not found'}));
            
    }  

    static removeComment(req, res) {
        Post.findById(req.params.post_id)
            .then(post => {
                if(!post) {
                    return res.status(404).json({ post: 'Post not found'});
                }
                console.log('FFFFESRTT');
                const newComment = {
                    name: req.body.name,
                    text: req.body.text,
                    user: req.user.id,
                    avatar: req.body.avatar
                }
                // Add the comment to the comments array in the post Model
                let indexOfCommentToBeRemoved = post.comments
                    .map(item => item.id)
                    .indexOf(req.params.comment_id);
                
                if (indexOfCommentToBeRemoved === -1) {
                    return res.status(404).json({ comment: 'The Comment to be deleted does not exist'});
                }

                if (post.comments[indexOfCommentToBeRemoved].user.toString() !== req.user.id)
                    return res.status(400).json({ like: 'You cannot delete a comment created by another user'});
                
                
                post.comments.splice(indexOfCommentToBeRemoved, 1);
                post.save().then(post => res.status(200).json(post));
            })
            .catch(err => res.status(404).json({ post: 'The post was not foundzz'}));
    }  


}

export default PostController;
