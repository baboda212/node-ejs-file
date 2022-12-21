const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');

let posts = []; //글(임시적으로 사용하는 변수) 데이터

//파일을 불러오기(읽기)
const readfile = fs.readFileSync('postDB.json', 'utf-8');

//오브젝트 코드로 변환
const jsonData = JSON.parse(readfile);
//console.log(jsonData);
//post에 배열값을 추가(복사)
posts = [...jsonData];

//ejs 를  view엔진으로 설정하기
app.set('view engine', 'ejs');

//정적파일 경로 지정(외부css파일 불러오기)
app.use(express.static("public"));

//post방식으로 라우팅하기 위해 모듈 추가
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//home 라우팅
app.get('/', function(요청, 응답){
    응답.render('pages/index.ejs',{ posts })
})

//create라우팅
app.post('/create', function(req, res){
    const 글 = req.body.post;
    //posts 배열 에 글 추가
    posts.push(글);
    //console.log('posts=', posts );
    //DB 파일에 글 저장(데이터를 저장할 때 JSON 스트링 파일로 저장해!)
    fs.writeFileSync('postDB.json', JSON.stringify(posts));
    //console.log(posts)
    //홈게시판으로이동(화면에 보이기)
    res.redirect('/');
})

//about 라우팅
app.get('/about', function(req, res){
    res.render('pages/about.ejs');
})


const port = 3001;
app.listen(port,() =>{
    console.log(`sever running at ${port}`);
});