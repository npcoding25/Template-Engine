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
let userId = 1

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
    const manager = new Manager ( managerInfo.name, userId++, managerInfo.email, managerInfo.office )
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
            ? new Engineer ( employeeInfo.name, userId++, employeeInfo.email, employeeInfo.info )
            : new Intern ( employeeInfo.name, userId++, employeeInfo.email, employeeInfo.info )
        teamList.push(employee)

        console.log(`${employeeInfo.name} has been added to the team. There are now ${teamList.length} members in your team.`)
    }

    if( !fs.existsSync(OUTPUT_DIR) ) fs.mkdirSync(OUTPUT_DIR)

    fs.writeFileSync(outputPath, render(teamList), "utf-8");

    console.log( `Finished writing to: ${outputPath}`)
}
main()
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
