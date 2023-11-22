const notesRouter = require('express').Router()
const Note = require('../models/note')
require('express-async-errors')

/* Get all notes */
notesRouter.get('/', async (request, response) => {
  await Note.find({}).then(notes => {
    response.json(notes)
  })
})

/* Get specific note */
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

/* Create a note */
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  await note.save()
    .then(savedNote => {
      response.status(201).json(savedNote)
    })
})

/* Update a note */
notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

/* Delete a note */
notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
})

module.exports = notesRouter
