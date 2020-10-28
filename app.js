const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

// Creating path to place finished template into
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// Acquiring render function from file
const render = require("./lib/htmlRenderer");

// Creating array of team members and starting the id at 1
let teamList = []
let employeeId = 1

// All logic wrapped in a async function
async function main() {
    console.log("Welcome to the only place you can build a software engineering team in 2 minutes!")
    
    // Questions for user
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

    // Adding a new manager and pushing it into the team list array
    const manager = new Manager ( managerInfo.name, employeeId++, managerInfo.email, managerInfo.officeNumber )
    teamList.push(manager)

    console.log(`Saving manager:  ${managerInfo.name}`)

    // Loop through questions based on how many team members user chose
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
                message: `${employeeType=="Engineer" ? "What is the Engineer's github account?" : "Where did the intern go to school?"}`
            }
        ])

        // If the employee type is engineer then add a new engineer, other wise add an intern
        const employee = employeeType=="Engineer"
            ? new Engineer ( employeeInfo.name, employeeId++, employeeInfo.email, employeeInfo.info )
            : new Intern ( employeeInfo.name, employeeId++, employeeInfo.email, employeeInfo.info )
        
        // Push the new employee into the team list array
        teamList.push(employee)

        console.log(`${employeeInfo.name} has been added to the team. There are now ${teamList.length} members in your team.`)
    }

    // Create directory if it doesn't already exist
    if( !fs.existsSync(OUTPUT_DIR) ) fs.mkdirSync(OUTPUT_DIR)

    // Writing HTML file
    fs.writeFileSync(outputPath, render(teamList), "utf-8");

    console.log( `Finished writing to: ${outputPath}`)
}
main()