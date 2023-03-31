const express = require('express')
const app = express()

app.listen(3000, () => {console.log('서버접속');})
app.set('view engine', 'ejs')
app.use('/public', express.static('public'))
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://semy:somy1505@cluster0.xowchoh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
const dbName = 'todo';

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('post');
 
  return 'done.';
}

main()
  .then(() => {console.log('여기');})
  .catch(console.error)
    .finally(() => client.close());
  
app.get('/', function (req, res) { 
    collection('post').find().toArray(function (err, result) { 
        res.render('index.ejs', {post:result})
    })
})
