//@ts-check
const express = require('express')
const multer = require('multer')
const upload = multer({dest:'uploads/'})
const router = express.Router()

const USERS = {
    15:{
        nickname : 'foo',
        profileImageKey : undefined,
    },
    16:{
        nickname : 'bar',
        profileImageKey : undefined,
    },
}
router.get('/',(req,res) => {
    res.send('User list')
})

//param을 먼저수행하고 패턴 수행 
router.param('id',async (req,res,next,value)=>{
    try{
        // @ts-ignore
        const user =USERS[value]
            
        if(!user){
            const err =new Error('User not found.')
            err.statusCode = 404 
            throw err
        }
        //@ts-ignore
        req.user=user
        next()
    }
    catch(err){
        next(err)
    }
    
    
})

router.get('/:id',(req,res) => {
    const resMimeType = req.accepts(['json','html'])

    if(resMimeType ==='json'){
        // @ts-ignore
        res.send(req.user)
    }else if (resMimeType ==='html'){
        res.render('user-profile',{
            //@ts-ignore
            nickname : req.user.nickname,
            userId: req.params.id,
            profileImageURL:'/uploads/'+req.user.profileImageKey
            //profileImageURL:'/uploads/2a96f31362b811bf0b96d8df48c66dbc',
        })
    }
})

router.post('/',(req,res) => {
    res.send('User registered.')
})

router.post('/:id/nickname',(req,res)=>{
    //req:{"nickname":"bar"}
    //@ts-ignore
    const { user } = req
    
    const { nickname } = req.body
    user.nickname = nickname
    res.send('User nickname update : ')
})

router.post('/:id/profile', upload.single('profile'),(req,res)=>{
    
    const {user} = req
    const {filename} = req.file
    user.profileImageKey = req.filename
    //user.profileImageKey
    res.send('user profile image uploaded')
})
module.exports=router



