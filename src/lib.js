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

    app.use(handler)

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
    get: (...args) => request.apply(null, ['get'].concat(args)),
    post: (...args) => request.apply(null, ['post'].concat(args)),
    put: (...args) => request.apply(null, ['put'].concat(args)),
    del: (...args) => request.apply(null, ['del'].concat(args)),
    head: (...args) => request.apply(null, ['head'].concat(args))
  }
}
