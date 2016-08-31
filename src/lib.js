export default (express, supertest) => {

  const request = (method, path, ...handlers) => {
    if (typeof path !== 'string') {
      handlers.unshift(path)
      path = '/'
    }
    const handler = handlers.pop()
    const app = express()
    handlers.forEach(middleware => {
      app.use(middleware)
    })

    app[method](path, handler)

    const wrapper = supertest(app)[method](path)
    wrapper.expectError = handler => {
      app.use((err, req, res, next) => {
        handler(err, req, res)
        next(err)
      })
      return wrapper
    }
    return wrapper
  }

  return {
    request,
    get: (...args) => assert.apply(null, ['get'].concat(args)),
    post: (...args) => assert.apply(null, ['post'].concat(args)),
    put: (...args) => assert.apply(null, ['put'].concat(args)),
    del: (...args) => assert.apply(null, ['del'].concat(args)),
    head: (...args) => assert.apply(null, ['head'].concat(args))
  }
}
