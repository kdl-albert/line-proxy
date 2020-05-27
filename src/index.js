const Koa = require('koa');
const app = new Koa();

const koaBody = require('koa-body');

const Router = require('koa-router');
const router = new Router();

const IO = require('koa-socket');
const io = new IO();

io.attach(app);

app.use(router.routes())
  .use(router.allowedMethods());

console.log('server start');

const forward2Local = (data) => {
  return async (ctx, next) => {

    io.broadcast('message', {
      query: JSON.stringify(ctx.request.query),
      body: JSON.stringify(ctx.request.body),
      header: JSON.stringify(ctx.request.header)
    });

    ctx.set('Content-Type', 'text/plain');
    ctx.status = 200;
    ctx.body = 'OK';
  }
};

const forwardHtml2Local = () => {
  return async (ctx, next) => {
    ctx.set('Content-Type', 'text/plain');
    ctx.status = 200;
    ctx.body = JSON.stringify(ctx);
  };
};

const checkStatus = () => {
  return async (ctx, next) => {
    ctx.set('Content-Type', 'text/plain');
    ctx.status = 200;
    ctx.body = 'Server Working...';
  }
};

router.post('/', koaBody(), forward2Local());
router.post('/message', koaBody(), forward2Local());
router.get('/downloaded', forwardHtml2Local());
router.get('/', checkStatus());


app.io.on('join', (ctx, data) => {
  console.log('join event fired', data)
});

app.io.on('connection', socket => {
  console.log('connected');
});

app.io.on('error', function () {
  console.log('error');
});

app.io.on('data', socket => {
  console.log('data');
});

app.listen(process.env.PORT || 3035);
