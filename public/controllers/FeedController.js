import {ajax} from '../modules/ajax';
import {backend} from '../modules/url';
import {router} from "../main";
import {CommentModel} from '../models/CommentModel';
import ChatOtherMessage from "../components/ChatContent/ChatOtherMessage.hbs";
import {ChatModel} from "../models/ChatModel";
import {Chats} from '../components/Chats/Chats';

export class FeedController {
    #view
    #profile
    #feed
    #chats
    #comments
    #websocket

    #currentUserFeed

    constructor(feedView, userModel, feedListModel, chatListModel, commentsListModel) {
        this.#view = feedView;
        this.#profile = userModel;
        this.#feed = feedListModel;
        this.#chats = chatListModel;
        this.#comments = commentsListModel;

        this.#currentUserFeed = 0;
    }

    set view(view) {
        this.#view = view;
    }

    async updateWebsocket() {
        this.#websocket = await new WebSocket(backend.websocket);
        this.#websocket.onmessage = this.onMessageWebsocket.bind(this);
    }

    async update() {
        await this.updateWebsocket();
        await this.#feed.update();
        await this.#chats.update();
        await this.#profile.update();
    }

    #makeContext() {
        return {
            profile: {
                id:         this.#profile.id,
                name:       this.#profile.name,
                job:        this.#profile.job,
                education:  this.#profile.education,
                aboutMe:    this.#profile.aboutMe,
                linkImages: this.#profile.linkImages,
                age:        this.#profile.age,
            },
            chats: {
                chats: this.#chats.chatList,
                user_id: this.#profile.id,
                onSendWebsocket: this.onSendWebsocket.bind(this),
            },
            feed: {
                feed: this.#feed.userList[this.#currentUserFeed],
                event: {
                    like: {
                        type: 'click',
                        listener: this.likeListener.bind(this),
                    },
                    dislike: {
                        type: 'click',
                        listener: this.dislikeListener.bind(this),
                    }
                }
            },
            settings: {
                settings: {
                    id:         this.#profile.id,
                    telephone:  this.#profile.telephone,
                    name:       this.#profile.name,
                    job:        this.#profile.job,
                    education:  this.#profile.education,
                    aboutMe:    this.#profile.aboutMe,
                    linkImages: this.#profile.linkImages,
                    age:        this.#profile.age,
                },
                event: {
                    logout: {
                        type: 'click',
                        listener: this.logoutListener.bind(this),
                    },
                    save: {
                        type: 'click',
                        listener: this.editUserListener.bind(this),
                    }
                },
                validate: {
                    passwords: {
                        message: '',
                    }
                }
            },
            comments: {
                comments: this.#comments,
                event: {
                    getComments: {
                        type: 'click',
                        listener: this.getUserCommentsListener.bind(this),
                    },
                    sendComment: {
                        type: 'click',
                        listener: this.sendCommentListener.bind(this),
                    },
                    getMyComments: {
                        type: 'click',
                        listener: this.getMyCommentsListener.bind(this),
                    },
                    sendMyComments: {
                        type: 'click',
                        listener: this.sendMyCommentsListener.bind(this),
                    },
                    getProfileByComment: {
                        type: 'click',
                        listener: this.getProfileByComment.bind(this),
                    },
                },
            },
        };
    }

    onSendWebsocket(user_id, chat_id, message, delivery) {
        const mes = {
            user_id: user_id,
            chat_id: chat_id,
            message: message,
            timeDelivery: delivery,
        }
        this.#websocket.send(JSON.stringify(mes));
        const scroll = document.getElementById('chat-box-text-area');
        scroll.scrollTop = scroll.scrollHeight;
    }

    pushEvent = ()  => {
        const chatsIcon = document.getElementsByClassName('chats-icon-button')[0];
        chatsIcon.classList.add('change-chat-icon');
    }

    onMessageWebsocket({data}) {
        const dataJSON = JSON.parse(data);
        console.log(dataJSON);
        console.log('get message');
        const chatModel = new ChatModel(dataJSON);
        const innerListChats = document.getElementsByClassName('inner-list-chats')[0]; // означает что отрисованы чаты
        const message = document.getElementById('chat-box-text-area');//означает что отрисован какой то чат
        const comments = document.getElementById('comments');//означает, что отрисованы комменты
        const profile = document.getElementsByClassName('profile')[0];// означает, что отрисован профиль

        if(innerListChats) {
            const chatList = this.#chats.chatList;
            const newChat = chatList.find( (chat) => {
                return chat.id === chatModel.id;
            });
            console.log(newChat);
            if (!newChat){
                const profileChatSection = document.getElementsByClassName('profile-chat-section')[0];
                const chats = new Chats(profileChatSection);
                chats.data = this.#makeContext()['chats'];
                
                innerListChats.appendChild(chats.createChat(chatModel));
                console.log(chatModel);
                this.#chats.appendChat(chatModel);
                const nc = document.getElementById('chat' + chatModel.id);
                nc.classList.add('chats-new');
            } else {
                const oldChat = document.getElementById('chat' + newChat.id);
                oldChat.classList.add('chats-new');
            }
        }

        if (message) {
            const chat = document.getElementById(chatModel.id);
            if (chat) {
                message.insertAdjacentHTML('beforeend', ChatOtherMessage({
                    message_text: dataJSON.messages[0].message,
                    time_delivery: dataJSON.messages[0].timeDelivery,
                }));
            } else {
                this.pushEvent();
            }
        }

        if(comments) {
            this.pushEvent();
        }

        if(profile) {
            this.pushEvent();
        }

        // const scroll = document.getElementById('chat-box-text-area');
        // scroll.scrollTop = scroll.scrollHeight;
    }

    async getProfileByComment(evt) {
        evt.preventDefault();

        const userID = evt.target.id;
        const comment = this.#comments.commentsList.find((comment) => {
            console.log(comment.user.id)
            return comment.user.id == userID;
        }, this);

        this.#view.context.otherProfile = {
            id:         comment.user.id,
            name:       comment.user.name,
            job:        comment.user.job,
            education:  comment.user.education,
            aboutMe:    comment.user.aboutMe,
            linkImages: comment.user.linkImages,
            age:        comment.user.age,
        };
        this.#view.renderOtherProfile();

        const comments = document.getElementById('profile-comments');
        comments.addEventListener('click', async (evt) => {
            evt.preventDefault();
            await this.#comments.update(comment.user.id);
            this.#view.renderComments();

            const send = document.getElementById('send-comment');
            send.addEventListener('click', async (evt) => {
                evt.preventDefault();
                const comment = new CommentModel({
                    user: this.#profile,
                    commentText: document.getElementById('text-comment').value,
                    timeDelivery: new Date().getHours() + ':' + new Date().getMinutes(),
                });
                await comment.addComment(comment.user.id);
                this.#view.context.comments.comments.commentsList.push(comment);
                this.#view.renderComments();
            });
        });
    }

    async getMyCommentsListener(evt) {
        evt.preventDefault();
        await this.#comments.update(this.#profile.id);
        this.#view.renderComments(true);
    }

    async getUserCommentsListener(evt) {
        evt.preventDefault();
        await this.#comments.update(this.#feed.userList[this.#currentUserFeed].id);
        this.#view.renderComments();
    }

    async sendCommentListener(evt) {
        evt.preventDefault();
        const comment = new CommentModel({
            user: this.#profile,
            commentText: document.getElementById('text-comment').value,
            timeDelivery: '',
        });
        await comment.addComment(this.#feed.userList[this.#currentUserFeed].id);
        this.#view.context.comments.comments.commentsList.push(comment);
        this.#view.renderComments();
    }

    async sendMyCommentsListener(evt) {
        evt.preventDefault();
        const comment = new CommentModel({
            user: this.#profile,
            commentText: document.getElementById('text-comment').value,
            timeDelivery: '',
        });
        await comment.addComment(this.#profile.id);
        this.#view.context.comments.comments.commentsList.push(comment);
        this.#view.renderComments(true);
    }

    async likeListener(evt) {
        evt.preventDefault();
        await this.#likeDislikeAjax(backend.like);
    }

    async dislikeListener(evt) {
        evt.preventDefault();
        await this.#likeDislikeAjax(backend.dislike);
    }

    async logoutListener(evt) {
        evt.preventDefault();
        await ajax.post(backend.logout, {})
            .then(({status, responseObject}) => {
                if (status === 500 || status === 401) {
                    throw new Error(`${status} logout error`);
                }
                router.redirect('/');
            })
            .catch((err) => {
                console.log(err.message);
                router.redirect('/');
            });
    }

    async editUserListener(evt) {
        evt.preventDefault();
        const data = this.#view.getSettingsData();
        if (data.password !== data.repeatPassword) {
            this.#view.context.settings.validate.passwords.message = 'Пароли не совпадают';
            this.#view.rerenderSettings();
            return;
        }

        await ajax.post(backend.settings, data)
            .then(async ({status, responseObject}) => {
                if (status === 400) {
                    throw new Error(`${status} settings error: bad request to server on /settings`);
                }
                if (status === 401) {
                    throw new Error(`${status} unauthorized: cannot post json on /settings`);
                }

                const saveButton = document.getElementById('save-button');
                saveButton.classList.add('pink-save');

                await this.#profile.update();
                this.#view.context = this.#makeContext();
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    async #likeDislikeAjax(url) {
        await ajax.post(url, {
            'user_id2': this.#feed.userList[this.#currentUserFeed].id
        })
            .then(({status, responseObject}) => {
                if (status === 401) {
                    throw new Error(`${status} unauthorized: cannot get json on url /like`);
                }

                if (this.#currentUserFeed === this.#feed.userList.length - 1) {
                    this.#currentUserFeed = 0;
                    this.#feed.update();
                } else {
                    this.#currentUserFeed++;
                }
                
                this.#view.context = this.#makeContext();
                this.#view.rerenderFeed();
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    async control() {
        await this.update()
            .then(() => {
                this.#view.context = this.#makeContext();
                this.#view.render();
            });
    }
}