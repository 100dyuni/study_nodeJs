// @ts-check

const express = require('express')
//const bodyParser = require('body-parser')
const fs =require('fs')
const userRouter = express.Router()
const app = express()
const PORT = 5000
//app.use(bodyParser.json())
app.use(express.json())
app.use('/public',express.static('src/public'))
app.set('views','src/views')
app.set('view engine','pug')
app.use('/users',userRouter)

//요청시 패턴을 이용하여도 가능 ㅋㅋㅋ '/ab?cd','/ab+cd','/ab*cd',/abcd$/
//배열도 가능 ['/abc',/xyz/]
/**
app.get('/',(req,res)=>{
    res.send('Root - Get')
})

app.post('/',(req,rest)=>{
    rest.send('Root - Post')
})

 */
//일관된 패턴을 갖은 api하나로 묶고 싶으면 라우터를 사용해도 괜찮다.
userRouter.get('/',(req,res) => {
    res.send('User list')
})

const USERS = {
    15:{
        nickname : 'foo',
    },
    16:{
        nickname : 'bar',
    },
}
//param을 먼저수행하고 패턴 수행 
userRouter.param('id',(req,res,next,value)=>{
    console.log(value)
    // @ts-ignore
    req.user=USERS[value]
    next()
})

userRouter.get('/:id',(req,res) => {
    const resMimeType = req.accepts(['json','html'])

    if(resMimeType ==='json'){
        // @ts-ignore
        res.send(req.user)
    }else if (resMimeType ==='html'){
        res.render('user-profile',{
            nickname : req.user.nickname,
        })
    }
})

userRouter.post('/',(req,res) => {
    res.send('User registered.')
})

userRouter.post('/:id/nickname',(req,res)=>{
    //req:{"nickname":"bar"}
    //@ts-ignore
    const { user } = req
    
    const { nickname } = req.body
    user.nickname = nickname
    res.send('User nickname update : ')
})



app.get('/',(req,res)=>{
    res.render('index',{
        message:'hello, pug!!!@!',
    })
})
app.listen(PORT,()=>{
    console.log('port number',PORT)
})
