// implement your posts router here
// const router = require('express').Router()
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
router.put('/:id', (req, res) => {

})

router.delete('/:id', (req, res) => {

})

router.get('/:id/comments', (req, res) => {

})


module.exports = router