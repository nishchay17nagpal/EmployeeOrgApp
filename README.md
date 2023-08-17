# EmployeeOrgApp
## Language Used

    TypeScript

## Example

    // Create the organization chart
    const ceo: Employee = {
        uniqueId: 1,
        name: "Employee1",
        subordinates: [
            {
                uniqueId: 2,
                name: "Employee2",
                subordinates: [],
            },
            {
                uniqueId: 3,
                name: "Employee3",
                subordinates: [],
            },
        ],
    };

    // Create an instance of EmployeeOrgApp
    const app = new EmployeeOrgApp(ceo);

    console.log("Initial Organization Chart:");
    console.log(JSON.stringify(app.ceo, null, 2));
    console.log("***************************************");

    app.move(2, 3);

    console.log("Organization Chart after Moving:");
    console.log(JSON.stringify(app.ceo, null, 2));
    console.log("***************************************");

    app.undo();

    console.log("Organization Chart after Undoing the Move:");
    console.log(JSON.stringify(app.ceo, null, 2));
    console.log("***************************************");

    app.redo();

    console.log("Organization Chart after Redoing the Move:");
    console.log(JSON.stringify(app.ceo, null, 2));

## Build

Run `node employeeOrgApp.ts` to execute the assignment.


