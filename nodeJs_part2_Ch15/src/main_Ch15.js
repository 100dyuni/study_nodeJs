// @ts-check

const { Client } = require('pg')

const program = require('commander')

const prompts = require('prompts')

async function connect(){
    const client = new Client({
        user: 'myuser',
        password:'mypass',
        database:'fc22',
    })
    await client.connect()
    return client
}

program
.command('list')
.action(async()=>{
    const client = await connect()
    const query = `SELECT * FROM users`
    const result = await client.query(query)
    console.log(result.rows)
    await client.end()
})



program
.command('add')
.action(async()=>{
    const client = await connect()
    const userName = await prompts({
        type : 'text',
        name : 'userName',
        message : 'Provide a user name to insert.',
    })
    const query = `INSERT INTO users (name) VALUES ($1::text) `
    await client.query(query,[userName.userName])
    await client.end()
})

program
.command('remove')
.action(async()=>{
    const client = await connect()
    const userName = await prompts({
        type : 'text',
        name : 'userName',
        message : 'Provide a user name to delete.',
    })
    //SQL injection이 가능한 지점, 데이터를 그대로 입력 받을경우 쿼리문을 조작하여 전체 삭제 하게 될수도 있다.
    const query = `DELETE FROM users WHERE name = $1::text `
    await client.query(query,[userName.userName])
    await client.end()
})


program.parseAsync()