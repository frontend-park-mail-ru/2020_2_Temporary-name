import './Profile.css';
import {backend} from './../../modules/url';
import {router} from '../../main';

export class Profile {

    #parent
    #data

    constructor(parent) {
        this.#parent = parent;
    }

    set data(data) {
        this.#data = data;
    }

    render() {
        const div = this.#createDiv('profile');
        const innerDiv = this.#createDiv('inner-profile');
        div.appendChild(innerDiv);

        innerDiv.innerHTML += `<img class="profile-avatar-photo" src="${this.#data.linkImages[0].trim()}">`;

        const profileInfo = this.#createDiv('my-profile-information');
        div.appendChild(profileInfo);

        const nameAge = this.#createSpan('my-name', `${this.#data.name}  <span id="my-age">${this.#data.age}</span>`);
        const universityWork = this.#createSpan('my-university-work', `${this.#data.education === '' ? this.#data.job : this.#data.education}`);
        const aboutMe = this.#createSpan('my-about-me', `${this.#data.aboutMe}`);

        const infoLogo = this.#createDiv('comments-logo');
        infoLogo.insertAdjacentHTML('afterbegin', `<img id="profile-comments" src="../../img/info.svg">`);

        profileInfo.appendChild(nameAge);
        profileInfo.appendChild(universityWork);
        profileInfo.appendChild(aboutMe);
        
        div.appendChild(infoLogo);

        this.#parent.appendChild(div);

        const logo = document.getElementById('profile-comments');
        logo.addEventListener('click', this.#getMyComments.bind(this));
    }

    #getMyComments(evt) {
        evt.preventDefault();
        
        const logo = document.getElementById('profile-comments');
        logo.removeEventListener('click', this.#getMyComments.bind(this));
        
        router.redirect(`/mcomments/${this.#data.id}`);
    }

    #createDiv = (className) => {
        const div = document.createElement('div');
        div.classList.add(className);

        return div;
    }

    #createSpan = (id, text, className = null) => {
        const span = document.createElement('span');
        span.id = id;
        span.innerHTML = text;
        if (className) {
            span.classList.add(className);
        }

        return span;
    }
}