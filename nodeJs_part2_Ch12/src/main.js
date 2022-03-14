// @ts-check

const {createApi} = require('unsplash-js')

const fetch = require('node-fetch');

const http = require('http')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')
const {pipeline} = require('stream')
const {promisify} = require('util')

const unsplash = createApi({
    accessKey: '__9vVEW0O9B1Otve2EP_wkpIxZvsD61zSgsoRdB2sTo',
    // @ts-ignore
    fetch ,
  });


/**
 * 
 * @param {string} query
 */
async function searchImage(query){
    const result = await unsplash.search.getPhotos({query})
    console.log(result.response.results)

    if(!result.response){
        throw new Error('Failed to  search image.')
    }
    const image = result.response.results[0]
    if(!image){
        throw new Error('No image found')
    }

    return {
        description:image.description || image.alt_description,
        url:image.urls.regular,
    }

}

/**
 * 이미지를 unsplash에서 검색하거나, 이미 잇다면 캐시된 이미지를 리턴합니다. 
 */
async function getCachedImageOrSearchedImage(query){
    const imageFilePath = path.resolve(__dirname,`../images/${query}`)

    if(fs.existsSync(imageFilePath)){
        return {
            message: `Returning chaced image : ${query}`,
            stream: fs.createReadStream(imageFilePath)
        }
    }

    const result = await searchImage(query)
    const resp = await fetch(result.url)

    await promisify(pipeline)(
        resp.body,
        fs.createWriteStream(imageFilePath)
    )
    
    return{
        message: `Returning new image : ${query}`,
        stream: fs.createReadStream(imageFilePath),
    } 
}
/**
 * 
 * @param {string} url 
 */
function convertURLToImageInfo(url){
    const urlObj =new URL(url,'http://localhost:5000')

    /**
     * 
     * @param {string} name 
     * @param {number} defaultValue 
     * @returns 
     */
    function getSearchParam(name,defaultValue){
        const str = urlObj.searchParams.get(name)
        return str ? parseInt(str,10): defaultValue
    }
    const width = getSearchParam('width',400)
    const height = getSearchParam('height',400)

    return {
        query : urlObj.pathname.slice(1),
        width,
        height,
    }
}

const server = http.createServer((req,res) =>{
    async function main(){
        if(!req.url){
            res.statusCode =400
            res.end('Needs URL')
            return 
        }
        const {query,width,height} = convertURLToImageInfo(req.url)
        try{
            const {message, stream } = await getCachedImageOrSearchedImage(query)
            await promisify(pipeline)(
                stream,
                sharp().resize(width,height,{
                    fit : 'contain',
                    background : '#ffffff',
                }).png(),
                res,
                )
            console.log(message,width,height)
            stream.pipe(res)
        }catch{
            res.statusCode=400
            res.end()
        }        
    }
    main()
})

const PORT = 5000

server.listen(PORT,()=>{
    console.log('port',PORT)
})



