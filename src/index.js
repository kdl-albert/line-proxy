const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const router = new Router();

const IO = require('koa-socket');
const io = new IO();

io.attach(app);

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3035);

console.log('server start');

const forward2Local =  (data) => {
  return async (ctx, next) => {
    console.log('forward2Local');
    console.log(ctx);
    console.log(next);
    ctx.set('Content-Type', 'text/plain');
    ctx.status = 200;
    ctx.body = 'OK';
  }

};

//-------------------------------------------------------
// proxy 設定 (HTTP → socket.io)
//-------------------------------------------------------
// /engine
router.post('/:url', forward2Local() );
router.get('/', forward2Local() );
router.get('/abc', forward2Local() );


app.io.on( 'connection', socket => {
  console.log('connected');
});


app.io.on( 'data', socket => {
  console.log('data');
});
