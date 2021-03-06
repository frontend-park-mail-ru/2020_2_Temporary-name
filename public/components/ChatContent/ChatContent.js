import ChatContentHbs from './ChatContent.hbs';
import ChatMyMessage from './ChatMyMessage.hbs';
import ChatOtherMessage from './ChatOtherMessage.hbs';
import './ChatContent.css';
import {Profile} from "../Profile/Profile";

//parent = profile-chat-section
export class ChatContent {
    #parent
    chatModel
    listenerSend
    getCommentsListener

    constructor(parent, chatModel) {
        this.#parent = parent;
        this.chatModel = chatModel;
        console.log('this.chatModel');
        console.log(this.chatModel);
    }
    async render() {
        // this.#parent.innerHTML = '';

        await this.#parent.insertAdjacentHTML('beforeend', ChatContentHbs(
            {
                path_photo: this.chatModel.partner.linkImages[0],
                nameUser: this.chatModel.partner.name,
                userId: 'user' + this.chatModel.partner.id,
            }));

        document.getElementById('user' + this.chatModel.partner.id).addEventListener(
            'click', (evt) => {
                evt.preventDefault();

                const profileChatSection = document.getElementsByClassName('profile-chat-section')[0];
                profileChatSection.innerHTML = '';
                const profile = new Profile(profileChatSection);

                profile.data = this.chatModel.partner;
                profile._userId = this.chatModel.partner.id;
                profile.render();
            

                console.log(this.getCommentsListener);

                const comments = document.getElementById('profile-comments');
                comments.addEventListener(this.getCommentsListener.type,
                    this.getCommentsListener.listener);
            }
        );

        const messages = document.getElementById('chat-box-text-area');
        console.log(this.chatModel.messages);
            
        if (this.chatModel.messages) {
            this.chatModel.messages.forEach( (message) => {
                if (message.user_id === this.chatModel.partner.id) {
                    messages.insertAdjacentHTML('beforeend', ChatOtherMessage({
                        message_text: message.message,
                        time_delivery: message.timeDelivery,
                    }));
                } else {
                    messages.insertAdjacentHTML('beforeend', ChatMyMessage({
                        message_text: message.message,
                        time_delivery: message.timeDelivery,
                    }));
                }
            });
        }

        const scroll = document.getElementById('chat-box-text-area');
        scroll.scrollTop = scroll.scrollHeight;

        // const button = document.getElementById('send');
        const button = document.getElementsByClassName('chat__box__message-box__message__send')[0];
        button.addEventListener('click', (evt) => {
            console.log(this.chatModel.validationMessage(document.getElementById('message').value));
            if (!this.chatModel.validationMessage(document.getElementById('message').value)) {
                return;
            }
            const delivery = (new Date().getHours() + ':' + new Date().getMinutes()).toString();
            messages.insertAdjacentHTML('beforeend', ChatMyMessage({
                message_text: document.getElementById('message').value,
                time_delivery: delivery,
            }));
            this.listenerSend( this.chatModel.user_id, this.chatModel.id ,document.getElementById('message').value, delivery);
            document.getElementById('message').value = '';
        });
    }


}
