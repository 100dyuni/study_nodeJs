// @ts-check
// Template engine : pug
// Css Framwork : TailwindCss
const Koa = require('koa');

const Pug = require('koa-pug');

const path = require('path')
const websockify = require('koa-websocket')
 
const app = websockify(new Koa());

const route = require('koa-route')
const serve = require('koa-static')
const mount = require('koa-mount')

const MongoClient = require('./mongo');
const client = require('./mongo');
// @ts-ignore
// eslint-disable-next-line no-new
new Pug({
    viewPath: path.resolve(__dirname, './views'),
    app, 
  })

app.use(mount('/public',serve('src/public')))
app.use(async (ctx) => {
  await ctx.render('main')
});

// eslint-disable-next-line no-underscore-dangle
const _client = MongoClient.connect()

async function getChatsColletion(){
  const client = await _client
  return client.db('chat').collection('chats')
}
// Using routes
app.ws.use(route.all('/ws', async(ctx) => {

  const chatsColletcion = await getChatsColletion()
  const chatsCursor = chatsColletcion.find({},{
    sort:{
      createdAt:1,
    }
  })

  const chats = await chatsCursor.toArray()

  ctx.websocket.send(JSON.stringify({
    type:'sync',
    payload :{
      chats,
    }
  }))

  ctx.websocket.on('message', async(data) =>{
        if(typeof data !=='string'){
          return
        }
        
        /** @type {Chat} */
        const chat = JSON.parse(data)
        await chatsColletcion.insertOne({...chat, createdAt: new Date(),})

        const {nickname,message} = chat
        const {server} = app.ws
        if(!server){
          return
        }

        //브로드캐스트
        server.clients.forEach((client) =>{
          client.send(
            JSON.stringify({
              type : 'chat',
              payload :{
                nickname,
                message,
              },
              
            })
          )
        })
       
  });
}));

app.listen(5000);