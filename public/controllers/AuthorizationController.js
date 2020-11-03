import {RegAuthModel} from "../models/RegAuthModel";
import {RegistrationView} from "../views/RegistrationView";
import {router} from "../main";

export class AuthorizationController {
    authorizationView
    authorizationModel

    constructor(authorizationView, authorizationModel) {
        this.authorizationModel = authorizationModel;
        this.authorizationView = authorizationView;
        this.authorizationView.model = this.authorizationModel;
        this.authorizationView.listenerAuthorization = this.listenerAuthorization.bind
                                                        (this.listenerAuthorization, this.authorizationModel);
    }

    control() {
        this.authorizationView.render();
    }

    async listenerAuthorization(model) {
        console.log('aaaa');
        let mes;
        mes = document.getElementById('mes');
        const telephone = document.getElementById('number');
        if (!telephone.validity.valid) {
            mes.innerHTML = 'Неверно введен номер телефона';
            return;
        }
        const [message, result] = model.setTelephonePasswordAuth
                                        (document.getElementById('number').value,
                                         document.getElementById('password').value);
        if (!result) {
            mes.innerHTML = message;
            console.log(message);
            return false;
        }
        console.log(mes);
        await model.authorization()
            .then( () => {
                //redirect on feed
            })
            .catch( (err) => {
                console.log(err.message);
                router.redirect('/');
            })
        console.log(mes);
    }
}