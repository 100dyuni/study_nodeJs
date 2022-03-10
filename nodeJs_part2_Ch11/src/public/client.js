// @ts-check

// IIFE
;(() => {
    const socket = new WebSocket(`ws://${window.location.host}/ws`)
    const formEl = document.getElementById('form1')
    /** @type {HTMLInputElement |null} */
    // @ts-ignore
    const inputEl= document.getElementById('input1')
    const chatsEl= document.getElementById('chats')
    if(!formEl||!inputEl || !chatsEl){
        throw new Error('Init failed!')
    }


    /**
     * @typedef Chat
     * @property {string} nickname
     * @property {string} message
     * 
     */

    /**
     * @type {Chat[]}
     * 
     */
    const chats = []

    const adjectives = ['멋진','훌룡한','친절한','새침함']
    const loNpc = ['니나브','쿠크','웨이','샨디','아제나']

    /**
     * @param {string[]} array
     * @return {string}
     */
    function pickRandom(array){
        const randomIdx = Math.floor(Math.random() * array.length)
        const result = array[randomIdx]
        if(!result){
            throw new Error('array Length is  0.')
        }
        return result
    }

    const myNickname = `${pickRandom(adjectives)}${ pickRandom(loNpc)}`

    formEl.addEventListener('submit',(event)=>{
        event.preventDefault()
        socket.send(JSON.stringify({
            nickname :myNickname,
            message:inputEl.value
            })
        )
        inputEl.value=''
        
    })

    socket.addEventListener('open',()=>{
        //socket.send('Hello, server!')
    })

    const drawChats = () =>{
        chatsEl.innerHTML=''
        chats.forEach(({message,nickname}) => {
            const div = document.createElement('div')
            div.innerText = `${nickname } : ${ message}`
            chatsEl.appendChild(div)
        })
    }
    socket.addEventListener('message',(event)=>{
        const {type, payload} =JSON.parse(event.data)
       
        if(type ==='sync'){
            const {chats:syncedChats} = payload
            chats.push(...syncedChats)

        }else if(type ==='chat') {
            const chat = payload
            chats.push(chat)
        }
        
        drawChats()

      

    })

})()




