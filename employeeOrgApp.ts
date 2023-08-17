interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
}

interface Action {
    action: "move";
    employeeId: number;
    sourceSupervisorId: number;
    targetSupervisorId: number;
}

interface IEmployeeOrgApp {
    ceo: Employee;
    move(employeeID: number, supervisorID: number): void;
    undo(): void;
    redo(): void;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
    private history: Action[] = [];
    private redoHistory: Action[] = [];

    constructor(public ceo: Employee) { }

    move(employeeId: number, supervisorId: number): void {
        const employee = this.findEmployeeById(employeeId, this.ceo);
        const supervisor = this.findEmployeeById(supervisorId, this.ceo);

        if (employee && supervisor) {
            const oldSupervisor: any = this.findSupervisor(employeeId, this.ceo);
            this.removeSubordinate(employeeId, oldSupervisor);

            supervisor.subordinates.push(employee);

            this.history.push({
                action: "move",
                employeeId,
                sourceSupervisorId: oldSupervisor!.uniqueId,
                targetSupervisorId: supervisorId,
            });
            this.redoHistory = [];
        }
    }

    undo(): void {
        const lastAction = this.history.pop();
        if (lastAction && lastAction.action === "move") {
            const { employeeId, sourceSupervisorId, targetSupervisorId } = lastAction;

            this.move(employeeId, sourceSupervisorId);
            this.redoHistory.push({
                action: "move",
                employeeId,
                sourceSupervisorId: sourceSupervisorId,
                targetSupervisorId: targetSupervisorId,
            });
        }
    }

    redo(): void {
        const lastRedoAction = this.redoHistory.pop();
        if (lastRedoAction && lastRedoAction.action === "move") {
            this.move(lastRedoAction.employeeId, lastRedoAction.targetSupervisorId);
            this.history.push({
                action: "move",
                employeeId: lastRedoAction.employeeId,
                sourceSupervisorId: lastRedoAction.sourceSupervisorId,
                targetSupervisorId: lastRedoAction.targetSupervisorId,
            });
        }
    }

    private findEmployeeById(employeeId: number, supervisor: Employee): Employee | undefined {
        if (supervisor.uniqueId === employeeId) {
            return supervisor;
        }

        for (const subordinate of supervisor.subordinates) {
            const foundEmployee = this.findEmployeeById(employeeId, subordinate);
            if (foundEmployee) {
                return foundEmployee;
            }
        }

        return undefined;
    }

    private findSupervisor(employeeId: number, supervisor: Employee, parent: Employee | null = null): Employee | null {
        if (supervisor.uniqueId === employeeId) {
            return parent;
        }

        for (const subordinate of supervisor.subordinates) {
            const foundSupervisor = this.findSupervisor(employeeId, subordinate, supervisor);
            if (foundSupervisor) {
                return foundSupervisor;
            }
        }

        return null;
    }

    private removeSubordinate(employeeId: number, supervisor: Employee): boolean {
        const index = supervisor.subordinates.findIndex((employee) => employee.uniqueId === employeeId);

        if (index !== -1) {
            supervisor.subordinates.splice(index, 1);
            return true;
        }

        for (const subordinate of supervisor.subordinates) {
            if (this.removeSubordinate(employeeId, subordinate)) {
                return true;
            }
        }

        return false;
    }
}
