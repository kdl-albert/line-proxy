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

const forward2Local =  (data) => {
  return async (ctx, next) => {
    console.log(ctx.request);
    //console.log('forward2Local');
    //console.log('receive request query:', ctx.request.query);
    //console.log(`Request Body: ${JSON.stringify(ctx.request.body)}`);

    io.broadcast( 'message' , { query: ctx.request.query, body: ctx.request.body  } );

    ctx.set('Content-Type', 'text/plain');
    ctx.status = 200;
    ctx.body = 'OK';
  }

};

//-------------------------------------------------------
// proxy 設定 (HTTP → socket.io)
//-------------------------------------------------------
// /engine
router.post('/', koaBody(), forward2Local() );
router.post('/message', koaBody(), forward2Local() );
router.get('/', forward2Local() );
// router.get('/abc', forward2Local() );

//app.io.on( event, eventHandler );

app.io.on( 'join', ( ctx, data ) => {
  console.log( 'join event fired', data )
})

app.io.on( 'connection', socket => {
  console.log('connected');
});

app.io.on('error', function(){
  console.log('error');
});

app.io.on( 'data', socket => {
  console.log('data');
});

app.listen(process.env.PORT || 3035);
