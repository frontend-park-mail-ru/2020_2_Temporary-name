import {ajax} from '../modules/ajax';
import {backend} from '../modules/url';

export class UserModel {
    #id
    #name
    #telephone
    #password
    #day
    #month
    #year
    #sex
    #job
    #education
    #aboutMe
    #linkImages
    #age
    #isPremium
    #isSuperLikeMe
    #filter

    constructor(data = {}) {
        this.#fillUserData(data);
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name.toString();
    }

    get telephone() {
        return this.#telephone;
    }

    set telephone(telephone) {
        this.#telephone = telephone.toString();
    }

    get password() {
        return this.#password;
    }

    set password(password) {
        this.#password = password.toString();
    }

    get day() {
        return this.#day;
    }

    set day(day) {
        this.#day = day.toString();
    }

    get month() {
        return this.#month;
    }

    set month(month) {
        this.#month = month.toString();
    }

    get year() {
        return this.#year;
    }

    set year(year) {
        this.#year = year.toString();
    }

    get sex() {
        return this.#sex;
    }

    set sex(sex) {
        this.#sex = sex.toString();
    }

    get job() {
        return this.#job;
    }

    set job(job) {
        this.#job = job.toString();
    }

    get education() {
        return this.#education;
    }

    set education(education) {
        this.#education = education.toString();
    }

    get aboutMe() {
        return this.#aboutMe;
    }

    set aboutMe(aboutMe) {
        this.#aboutMe = aboutMe.toString();
    }

    get linkImages() {
        return this.#linkImages;
    }

    appendLinkImages(link_image) {
        this.#linkImages.push(link_image);
    }

    deleteImage(link_image) {
        console.log(link_image);
        console.log(this.#linkImages);
        this.#linkImages = this.#linkImages.filter( (item) => {
            return item !== link_image;
        });
        console.log(this.#linkImages);
    }

    get age() {
        return this.#age;
    }

    set age(age) {
        this.#age = age;
    }

    get isPremium() {
        return this.#isPremium;
    }

    set isPremium(isPremium) {
        this.#isPremium = isPremium;
    }

    get isSuperLikeMe() {
        return this.#isSuperLikeMe;
    }

    get filter() {
        return this.#filter;
    }

    set filter(filter) {
        this.#filter = filter;
    }

    #fillUserData(data) {
        this.#id = data['id'];
        this.#telephone = data['telephone'];
        this.#education = data['education'];
        this.#job = data['job'];
        this.#aboutMe = data['aboutMe'];
        this.#sex = data['sex'];
        this.#linkImages = data['linkImages'];
        this.#name = data['name'];
        this.#age = data['date_birth'];
        this.#day = data['day'];
        this.#month = data['month'];
        this.#year = data['year'];
        this.#password = data['password'];
        this.#isSuperLikeMe = data['is_superlike'];
        this.#filter = data['filter'];
    }

    async update() {
        await ajax.get(backend.me)
            .then(({status, responseObject}) => {
                if (status === 401) {
                    throw new Error(`${status} unauthorized: cannot get json on url /me`);
                }
                this.#fillUserData(responseObject);
                this.#validateImages();
            })
            .catch((err) => {
                console.log(err.message);
            });

        await ajax.get(backend.isPremium)
            .then(({status, responseObject}) => {
                if (status !== 200) {
                    throw new Error(`${status} error: cannot get on /is_premium`);
                }
                this.#isPremium = responseObject['is_premium'];
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    #validateImages() {
        this.#linkImages = this.#linkImages.map((link) => {
            if (link.startsWith('.')) {
                return link.substr(1);
            }
            return link;
        });
    }

    async addPhoto(form) {
        return await ajax.post(backend.addPhoto, new FormData(form), true);
    }

    async deletePhoto(link_image) {
        return await ajax.post(backend.removePhoto, {
            link_image: link_image,
        });
    }

    async updateOtherUser(user_id) {
        return await ajax.get(backend.user + user_id)
            .then( ({status, responseObject}) => {
                if (status === 401) {
                    throw new Error(`${status} unauthorized: cannot get json on url /user/id`);
                }
                this.#fillUserData(responseObject);
                this.#validateImages();
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
}