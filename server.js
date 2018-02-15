const express = require('express');
const app = express();

const fs = require('fs');
const query = fs.readFileSync('./graphql_query', 'utf8');
const GithubQuery = require('./scripts/githubQuery.js');
const transformProjects = require('./scripts/transformer.js');
const Stagger = require('./scripts/stagger.js');

const token = process.env.GITHUB_TOKEN;
const PORT=process.env.PORT || 8080;
const interval=+(process.env.INTERVAL || 15*60)

let data={data:{}};
const githubQuery=new GithubQuery(token,query,(body)=>{
  data=transformProjects(JSON.parse(body));
  console.log(`Recived data for ${data.length} projects`);
});

let fetcher=new Stagger(interval,()=>{githubQuery.fetch()});
fetcher.firstTrigger();

app.set('view engine', 'pug');

app.post('/trigger',(req,res)=>{
  fetcher.trigger();
  res.end();
})

app.get('/', function(req, res) {
  res.render('index', {data});
})

app.get('/project/:projectName', function(req, res) {
  let projectName=req.params.projectName.toLowerCase();
  console.log("fecthing deatails for ", projectName);

  projectData=data.find((project) => {
    return project.name.toLowerCase() == projectName;
  });

  if(projectData)
    res.render('project', {projectData});
  else
    res.status(404).send(`Could not find details for project: ${projectName}`);
})

app.listen(PORT,()=>console.log(`listening on ${PORT}`));
