const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let teamList = []
let employeeId = 1

async function main() {
    console.log("Welcome to the only place you can build a software engineering team in less then 5 minutes. Have fun!")
    
    const managerInfo = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the manager's name?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the manager's email?"
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is the manager's office number?"
        },
        {
            type: "input",
            name: "teamMembers",
            message: "How many other team members do you want?"
        },
    ])
    const manager = new Manager ( managerInfo.name, employeeId++, managerInfo.email, managerInfo.office )
    teamList.push(manager)

    console.log(`Saving manager:  ${managerInfo.name}`)

    for(let i=0; i<managerInfo.teamMembers; i++) {
        let employeeType = await inquirer.prompt([
            {
                type: "list",
                name: "type",
                message: "What type of employee do you want?",
                choices: ["Engineer", "Intern"]
            }
        ])
        employeeType = employeeType.type
      
        const employeeInfo = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: `What is the name of your ${employeeType}?`
            },
            {
                type: "input",
                name: "email",
                message: `What is the ${employeeType}'s email?`
            },
            {
                type: "input",
                name: "info",
                message: `What is the ${employeeType}'s ${employeeType=="Engineer" ? "Github" : "School"}`
            }
        ])
        const employee = employeeType=="Engineer"
            ? new Engineer ( employeeInfo.name, employeeId++, employeeInfo.email, employeeInfo.info )
            : new Intern ( employeeInfo.name, employeeId++, employeeInfo.email, employeeInfo.info )
        teamList.push(employee)

        console.log(`${employeeInfo.name} has been added to the team. There are now ${teamList.length} members in your team.`)
    }

    if( !fs.existsSync(OUTPUT_DIR) ) fs.mkdirSync(OUTPUT_DIR)

    fs.writeFileSync(outputPath, render(teamList), "utf-8");

    console.log( `Finished writing to: ${outputPath}`)
}
main()