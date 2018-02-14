const express = require('express');
const app = express();

const fs = require('fs');
const query = fs.readFileSync('./graphql_query', 'utf8');
const GithubQuery = require('./githubQuery.js');
const token = process.env.GITHUB_TOKEN;

let data={data:{}};
const githubQuery=new GithubQuery(token,query,(body)=>{
  data=JSON.parse(body);
  console.log("Recived data...\n", data);
});

githubQuery.fetch();

app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render('index', {projectsData: data.data});
})

app.get('/:project', function(req, res) {
  let projectName=req.params.project.toLowerCase();
  console.log("fecthing deatails for ", projectName);
  let projectDetails=data.data[projectName].projects.nodes[0];
  res.render('project', {projectDetails});
})

app.listen(3000, () => console.log('App listening on port 3000!'));
