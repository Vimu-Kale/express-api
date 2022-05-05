const isEmail = (email) =>{
    let mailformat = /^[a-z]+(?!.*(?:\_{2,}|\.{2,}))(?:[\.+\_]{0,1}[a-z])*@[a-z]+\.[a-z]{3}$/g;
    return mailformat.test(email);
}

const isPhoneNumber = (phone) =>{
    let phoneformat =/^\d{10}$/g;
    return phoneformat.test(phone);
}

const isValidName = (name) => {
    // let nameformat = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;
    // let nameformat = /^([a-zA-z]{0,10}\s{0,1}[a-zA-Z]{1,10}'?-?[a-zA-Z]{1,10})$/
    // let nameformat = /^([a-zA-z]\s{0,1}[a-zA-Z]'?-?[a-zA-Z]).{1,27}$/
    let nameformat = /(^[a-zA-Z\s]{2,30})/;
    return nameformat.test(name);
}

const isValidPassword = (password) => {
    let passwordFormat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    return passwordFormat.test(password);
}

module.exports={
    isEmail,
    isPhoneNumber,
    isValidName,
    isValidPassword,
}

