import {expect} from 'chai'
import express from 'express'
import supertest from 'supertest'
import Assert from './lib'

const assert = Assert(express, supertest)
const {
  request
} = assert

describe('express assert', () => {

  describe('request', () => {
    it('should request as normal', done => {
      const cut = (req, res, next) => {
        expect(req.method).to.eql('POST')
        res.json(true)
      }

      request('post', cut)
        .expect(res => {
          expect(res.body).to.be.true
        })
        .end(done)
    })

    it('should catch errors', done => {
      const err = new Error('Yup!')
      const cut = (req, res, next) => {
        next(err)
      }

      request('get', cut)
        .expectError(error => {
          expect(error).to.equal(err)
        })
        .end(done)
    })

    it('should request path', done => {
      const route = express.Router()
      route.get('/assumption', (req, res, next) => {
        res.json(true)
      })

      request('get', '/assumption', route)
        .expect(res => {
          expect(res.body).to.be.true
        })
        .end(done)
    })
  })
})
