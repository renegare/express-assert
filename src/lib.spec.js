import {expect} from 'chai'
import express from 'express'
import supertest from 'supertest'
import Assert from './lib'

const assert = Assert(express, supertest)
const {
  request,
  get,
  post
} = assert

describe('express assert', () => {
  it('should request as normal', done => {
    const cut = (req, res, next) => {
      expect(req.method).to.eql('GET')
      res.json(true)
    }

    request('get', cut)
      .expect(res => {
        expect(res.body).to.be.true
      })
      .end(done)
  })

  it('should catch errors', done => {
    const err = new Error('Yup!')
    const cut = (req, res, next) => {
      expect(req.method).to.eql('GET')
      next(err)
    }

    get(cut)
      .expectError(error => {
        expect(error).to.equal(err)
      })
      .end(done)
  })

  it('should request path', done => {
    const route = express.Router()
    route.post('/assumption', (req, res, next) => {
      expect(req.method).to.eql('POST')
      res.json(true)
    })

    post('/assumption', route)
      .expect(res => {
        expect(res.body).to.be.true
      })
      .end(done)
  })
})
