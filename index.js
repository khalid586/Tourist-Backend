const express = require('express');
const app = express();
const PORT = 5000;

app.get('/',(req,res)=>{
    res.send('Done successfully!')
})

app.listen(PORT,()=>{
    console.log(`App running at port ${PORT}`);
})