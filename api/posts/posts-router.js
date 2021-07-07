// implement your posts router here
const express = require('express')
const router = express.Router()
const Posts = require('./posts-model')

// get - returns an array of posts
router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({
            message: "The posts information could not be retrieved",
            error: err.message,
            stack: err.stack
        })
    })
})

// get - gets a specified post by id if the post exists
router.get('/:id', (req, res) => {
    const { id } = req.params

    Posts.findById(id)
    .then(posts => {
        if (!posts) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.json(posts)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "The post information could not be retrieved",
            error: err.message,
            stack: err.stack
        })
    })
})

// post - creates a new post if the post contains a title and contents in the body
router.post('/', (req, res) => {
    const { title, contents } = req.body

    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post" 
        })
    } else {
        Posts.insert({title, contents})
        .then(({ id }) => {
            return Posts.findById(id)
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message: "There was an error while saving the post to the database",
                error: err.message,
                stack: err.stack
            })
        })
    }
})

// put - updates post if the specified post exists
router.put('/:id', (req, res) => {
    const { title, contents  } = req.body 
    const { id } = req.params

    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Posts.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                return Posts.update(id, req.body)
            }
        })
        .then(entry => {
            if (entry) {
                return Posts.findById(id)
            }
        })
        .then(post => {
            if (post) {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be modified",
                error: err.message,
                stack: err.stack
            })
        }) 
    }
})

// delete - removes specified post from database and returns deleted post
router.delete('/:id', async (req, res) => {
    try {
        const postToDelete = await Posts.findById(req.params.id)
        if (!postToDelete) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            await Posts.remove(req.params.id)
            res.json(postToDelete)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            error: err.message,
            stack: err.stack
        })
    }
})

// get - returns an arrayof all the comment objects regarding specified post
router.get('/:id/comments', async (req, res) => {
    try {
        const postId = await Posts.findById(req.params.id)

        if (!postId) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const postWithComments = await Posts.findPostComments(req.params.id)
            res.json(postWithComments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            error: err.message,
            stack: err.stack
        })
    }
})

module.exports = router