class Yoomoney {
    // обязательные
    #receiver
    #quickpayForm
    #targets
    #paymentType
    #sum

    // не обязательные
    #formComment
    #shortDest
    #comment
    #successURL
    #needFio
    #needEmail
    #needPhone
    #needAddress

    constructor() {
        this.#receiver = '4100116156288733';
        this.#quickpayForm = 'shop';
        this.#targets = 'MIAMI';
        this.#paymentType = 'AC';
        this.#sum = '15';
        this.#formComment = 'MIAMI: премиум-аккаунт';
        this.#shortDest = 'MIAMI: премиум-аккаунт';
        this.#comment = 'Еще больше знакомств, еще больше любви';
        this.#successURL = 'https://mi-ami.ru/feed';
        this.#needFio = false;
        this.#needEmail = false;
        this.#needPhone = true;
        this.#needAddress = false;
    }

    json() {
        return {
            'receiver': this.#receiver,
            'quickpay-form': this.#quickpayForm,
            'targets': this.#targets,
            'paymentType': this.#paymentType,
            'sum': this.#sum,
            'formcomment': this.#formComment,
            'short-dest': this.#shortDest,
            'comment': this.#comment,
            'successURL': this.#successURL,
            'need-fio': this.#needFio,
            'need-email': this.#needEmail,
            'need-phone': this.#needPhone,
            'need-address': this.#needAddress,
        };
    }

    formData() {
        const json = this.json();

        const data = new FormData();
        Object.keys(json).forEach((key) => {
            data.append(key, json[key]);
        });

        return data;
    }
}

export const yoomoney = new Yoomoney();
export const yoomoneyUrl = 'https://yoomoney.ru/quickpay/confirm.xml';