const valid = ({ fullname, username, email, birthday, password, cf_password }) => {
    const err = {}

    if (!fullname) {
        err.fullname = "Hãy ghi tên của bạn."
    } else if (fullname.length < 5) {
        err.fullname = "Tên phải trên 5 ký tự."
    }

    if (!username) {
        err.username = "Hãy ghi username của bạn."
    } else if (username.replace(/ /g, '').length > 25) {
        err.username = "Username chỉ có tối đa 25 kí tự."
    }

    if (!email) {
        err.email = "Hãy ghi email của bạn."
    } else if (!validateEmail(email)) {
        err.email = "Email chưa đúng định dạng."
    }

    if (!birthday) {
        err.birthday = "Hãy ghi ngày sinh của bạn."
    }
    else {
        const currentDate = new Date();
        const userBirthday = new Date(birthday);
        const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();

        // Kiểm tra xem người dùng có trên 18 tuổi hay không
        if (ageDiff < 18) {
            err.birthday = "Bạn phải trên 18 tuổi để đăng ký."
        }
    }
    // else if (!validateEmail(email)) {
    //     err.email = "Email chưa đúng định dạng."
    // }

    if (!password) {
        err.password = "Hãy ghi password của bạn."
    } else if (password.length < 6) {
        err.password = "Mật khẩu phải trên 6 kí tự."
    }

    if (password !== cf_password) {
        err.cf_password = "Xác nhận mật khẩu không chính xác."
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}



function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default valid