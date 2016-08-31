## Usage

```
import {expect} from 'chai'
import express from 'express'
import supertest from 'supertest'
import ExpressAssert from 'express-assert'

const assert = ExpressAssert(express, supertest)
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
```

## Development

Ideally this should be in some git hook; but the minimal dev flow:

```
$ npm run dev
$ git commit ...
$ npm version patch
$ git push --follow-tags
$ npm run build
```

Do the above in the development branch. When ready merge to the master branch and the ci should handle publishing to npm 🍾
