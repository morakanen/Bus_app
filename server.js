const express = require('express');
const mongoose = require('mongoose');
const app = express();

const uri='mongodb+srv://alanbiju1234:Soidontforget@synoptic.q5e7ldv.mongodb.net/?retryWrites=true&w=majority'

async function connect(){
    try{
        await mongoose.connect(uri)
        console.log("Connected to mongoDB")
    }catch (error){
        console.error(error);
    }
}

connect();

app.listen(3000,()=>{
    console.log('listening on port 3000')
})