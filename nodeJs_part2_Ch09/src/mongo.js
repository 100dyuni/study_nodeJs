// @ts-check

const { USERWHITESPACABLE_TYPES } = require('@babel/types');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://duhuyn:qltTja!0902@cluster0.pwpas.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/** 
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/

async function main(){  
    await client.connect()
    
    const users = client.db('fc21').collection('users')
    const cities = client.db('fc21').collection('cities')
    await users.deleteMany({})
    await cities.deleteMany({})
    await cities.insertMany([
        {
            name:'서울',
            population : 1000,
        },
        {
            name:'부산',
            population : 350,
        },
    ])
    await users.insertMany([
        {
            name: 'Foo',
            birthYear : 2000,
            contacts:[
                {
                    type: 'phone',
                    number : '+820111112222',
                },
                {
                    type: 'home',
                    number : '+820133334444',

                },
            ],
            city:'서울',
        },
        {
            name: 'Bar',
            birthYear : 1995,
            city:'부산',
        },
        {
            name: 'Baz',
            birthYear : 2000,
            city:'부산',
        },
        {
            name: 'Poo',
            birthYear : 1993,
            city:'서울',
        },
    ])
    /** 
    await users.updateOne(
        {
        name: 'Baz'
        },
        {
            $set:{
                name:'Boo',
            },
        },
    )*/
    /** 
    await users.deleteOne({
        name:'Baz',
    })
    */

    const cursor = users.find(
        /**
        {   
            birthYear:{
                $gte:1995,
            },
        },{
            sort:{
                birthYear:1
            },
        }
        */
       {
           'contacts.type': 'phone',

       }
    )
    //await cursor.forEach(console.log);
    
    const cursor1 = users.aggregate([
        {
            $lookup:{
                from : 'cities',
                localField: 'city',
                foreignField: 'name',
                as: 'city_info',
            },
        },
        {
            $match:{
                $and:[
                    {
                        'city_info.population':{
                            $gte:500,
                        },
                    },
                    {
                        'birthYear':{
                            $gte:1995
                        }
                    }
                ]
                
            }
        },
        {
            $count : 'num_users',
        }
    ])
    await cursor1.forEach(console.log);
    console.log('OK')
    await client.close()
    
}
main()