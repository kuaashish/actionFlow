
const csat = require('./CSAT.js');
const constant = require("./constant.js")
module.exports = async ({ github, context }) => {

  let date = new Date();
  let totalMilliSeconds = date.getTime();
  let minutes = 30
  let millisecondsToSubtract = minutes * 60 * 1000;
  let closeTime = totalMilliSeconds-millisecondsToSubtract
  let newDate = new Date(closeTime)
  let ISOCloseTime = newDate.toISOString() 
  let closeTimeIssues  = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state:"closed", 
    labels:"stale",
    since:ISOCloseTime
  });

 let ISSUESLIST = closeTimeIssues.data
 for(let i=0;i<ISSUESLIST.length;i++){ 
  if(ISSUESLIST[i].node_id && ISSUESLIST[i].node_id.indexOf("PR") !=-1)
     continue
   
  let comments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: ISSUESLIST[i].number
  });
  
   console.log("line 32",comments)
  let strCom = JSON.stringify(comments)

  if(strCom.indexOf(constant.MODULE.CSAT.MSG) == -1){
       context.payload.issue = {}
       context.payload.issue.number = ISSUESLIST[i].number
       context.payload.issue.labels = ISSUESLIST[i].labels
       context.payload.issue.html_url = ISSUESLIST[i].html_url
      
       csat({github, context})
  }
 }
}
