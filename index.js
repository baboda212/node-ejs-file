const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');

let posts = []; //글(임시적으로 사용하는 변수) 데이터
let memo = ["서버 닫으면 사라지는 메모",];

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
    응답.render('pages/index.ejs',{ posts, memo })
    //응답시 덮어씌울 페이지 선정, 넣을 데이터 선정
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
//delete 라우팅(글 삭제요청)
app.post('/delete/:id', function(req, res){
    const id = req.params.id;
    console.log(id);
    //post배열의 값을 삭제(id값에 해당하는 posts 삭제)
    posts.splice(id, 1);
    console.log(posts);
    //db파일에 저장
    fs.writeFileSync('postDB.json', JSON.stringify(posts));
    res.redirect('/');
})

//서버가 닫히면 데이터도 같이 지워지는 양식 라우팅
app.post('/create1', function(req, res){
    const memos = req.body.post1;
    memo.push(memos);
    res.redirect('/');
})

//about 라우팅
app.get('/about', function(req, res){
    res.render('pages/about.ejs');
})

//localhost:3001로 지정
const port = 3001;
app.listen(port,() =>{
    console.log(`sever running at ${port}`);
});