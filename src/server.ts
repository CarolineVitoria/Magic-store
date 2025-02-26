import conexaoDB from "./../src/config/dbConnect";
//conexão db


//start server
import app from "./app";
const PORT = 3000;

conexaoDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`App está rodando em http://localhost:${PORT}`);
    })
})
