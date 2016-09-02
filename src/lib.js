export default (express, supertest) => {

  const request = (method, path, ...handlers) => {
    if (typeof path !== 'string') {
      handlers.unshift(path)
      path = '/'
    }
    const handler = handlers.pop()
    const app = express()
    app.set('env', 'test')
    handlers.forEach(middleware => {
      app.use(middleware)
    })

    app.use(handler)
    let appError
    app.use((err, req, res, next) => {
      appError = {err, req, res}
      next(err)
    })

    const wrapper = supertest(app)[method](path)
    wrapper.expectNextError = handler => {
      wrapper.expect(() => {
        if (appError) {
          handler(appError.err, appError.req, appError.res)
        }
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
