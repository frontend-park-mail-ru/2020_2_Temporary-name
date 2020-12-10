import {BaseView} from './BaseView';
import {AuthorizationContent} from '../components/AuthorizationContent/AuthorizationContent';
import {LandingHeader} from '../components/LandingHeader/LandingHeader';
import {mask} from '../modules/mask';
import {popupLanding} from '../modules/popupLanding';


export class AuthorizationView extends BaseView {
    model
    divFormView
    listenerAuthorization

    constructor(app) {
        super(app);
    }

    renderBase = () => {
        document.body.classList.add('landing-body-background');
        this._app.innerHTML = '';
        this._app.classList.add('registration-body-background');

        (new LandingHeader(this._app)).render();

        const div = document.createElement('div');
        div.classList.add('formView');
        this._app.appendChild(div);

        const divFormView = document.createElement('div');
        divFormView.classList.add('inner-formView');
        div.appendChild(divFormView);

        const footer = document.createElement('footer');
        footer.classList.add('landing-footer');
        this._app.appendChild(footer);

        divFormView.addEventListener('click', (evt) => {
            evt.stopPropagation();
        });
        this._app.addEventListener('click', popupLanding);

        return divFormView;
    }

    render() {
        this.divFormView = this.renderBase();

        const Form = document.createElement('form');
        Form.classList.add('form');
        const form = this.divFormView.appendChild(Form);

        (new AuthorizationContent(form)).render();

        const number = document.getElementById('number');
        number.addEventListener('input', mask, false);
        number.addEventListener('focus', mask, false);
        number.addEventListener('blur', mask, false);

        const button = document.getElementById('next');
        button.addEventListener('click', this.listenerAuthorization);

        const cancel = document.getElementsByClassName('cancelButton')[0];
        cancel.addEventListener('click', popupLanding);
    }

    // #renderBackPopup(evt) {
    //     evt.preventDefault();
    //     this._app.removeEventListener('click', this.#renderBackPopup);
    //     router.redirect('/');
    // }
}