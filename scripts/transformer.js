let transformCard=function(cardObj) {
  if(cardObj.content == null)
    return;

  let card=cardObj.content;
  let labels=card.labels ? card.labels.nodes : [];
  let assignees=card.assignees ? card.assignees.nodes: [];
  let title=card.title;
  let milestone=card.milestone;

  return {title, milestone, labels, assignees};
}

let transformColumn=function(column) {
  let cards=column.cards.nodes;
  let transformedCards=cards.map(transformCard);

  return {name: column.name, cards: transformedCards};
}

let transformProject=function(projectDetails) {
  let project=projectDetails.projects.nodes[0];
  let columns=project.columns.nodes;

  let transformedColumns=columns.map(transformColumn);
  return {name: project.name, columns: transformedColumns};
}

let transformProjects=function(result) {
  let allProjects=Object.keys(result.data);
  let transformedProjects=allProjects.map((projectName) => {
    return transformProject(result.data[projectName]);
  });

  return transformedProjects;
}

module.exports=transformProjects
