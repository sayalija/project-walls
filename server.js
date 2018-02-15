const express = require('express');
const app = express();

const fs = require('fs');
const query = fs.readFileSync('./graphql_query', 'utf8');
const GithubQuery = require('./scripts/githubQuery.js');
const Stagger = require('./scripts/stagger.js');

const token = process.env.GITHUB_TOKEN;
const PORT=process.env.PORT || 8080;
const interval=+(process.env.INTERVAL || 15*60)

let data={data:{}};
const githubQuery=new GithubQuery(token,query,(body)=>{
  data=JSON.parse(body);
  console.log("Recived data...\n", data);
});

let fetcher=new Stagger(interval,()=>{githubQuery.fetch()});
fetcher.firstTrigger();

app.set('view engine', 'pug');

app.post('/trigger',(req,res)=>{
  fetcher.trigger();
  res.end();
})

app.get('/', function(req, res) {
  res.render('index', {projectsData: data.data});
})

app.get('/project/:projectName', function(req, res) {
  let projectName=req.params.projectName.toLowerCase();
  console.log("fecthing deatails for ", projectName);
  if(data.data[projectName]) {
    let projectDetails=data.data[projectName].projects.nodes[0];
    res.render('project', {projectDetails});
  }
  res.status(404).send(`Could not find details for project: ${projectName}`);
})

app.listen(PORT,()=>console.log(`listening on ${PORT}`));
