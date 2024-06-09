export default class AuthService {
    constructor() {
        this.users = [
            {
                email: "cucharoth@cucha.com",
                password: "123456",
                userName: "Cucharoth",
                groups: [
                    {
                        id: 0,
                        name: "ESP1",
                    },
                    {
                        id: 1,
                        name: "ISOFT ENTREGA FINAL",
                    },
                ],
            },
            {
                email: "elnico@nico.com",
                password: "123456",
                userName: "Elnico",
                groups: [
                    {
                        id: 0,
                        name: "ESP1",
                    },
                    {
                        id: 1,
                        name: "ISOFT ENTREGA FINAL",
                    },
                ],
            },
        ];
    }

    checkUserValido(email, password) {
        var currentUser = this.users.filter(
            (user) => user.email === email && user.password === password
        );
        if (currentUser.length === 0) {
            return null;
        }
        return new CurrentUser(currentUser[0].userName, currentUser[0].groups);
    }
}
export class CurrentUser {
    constructor(userName, groups) {
        this.userName = userName;
        this.groups = groups;
    }
}


