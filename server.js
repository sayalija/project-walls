const express = require('express');
const app = express();

const fs = require('fs');
const query = fs.readFileSync('./graphql_query', 'utf8');
const GithubQuery = require('./githubQuery.js');
const token = process.env.GITHUB_TOKEN;

let data={data:{}};
const githubQuery=new GithubQuery(token,query,(body)=>{
  console.log("Received update...");
  data=JSON.parse(body);
});

githubQuery.fetch();

app.set('view engine', 'pug');

app.get('/', function(req, res) {
  console.log(data);
  res.render('index', {projectsData: data.data});
})

app.listen(3000, () => console.log('App listening on port 3000!'));
