import axios from 'axios'


export function secure_password(password) {
    const messsage = 'Your password must contain at least '
    if (password.length < 8) {
        return ('The password is too short (must contain atleast 8 characters)')
    } else {
        if (password.search(/[0-9]/) < 0) {
            return (messsage + 'digit')
        } else if (password.search(/[A-Z]/) < 0) {
            return (messsage + 'uppercase character')
        } else if (password.search(/[a-z]/) < 0) {
            return (messsage + 'lowercase character')
        } else if (password.search(/[!@#$%^&*]/) < 0) {
            return (messsage + 'special character')
        } else {
            return ("good")
        }
    }
}

export async  function axios_post(url, data) {
    const path = 'http://localhost:5000' + url
    try {
        const result = await axios.post(path, data)
        return result
    } catch (error) {
        return "Oops!"
    }
}

export async function post_comment(url, data) {
    const path = 'http://localhost:5000' + url
    try {
        const result = await axios.post(path, data)
        return result
    } catch (error) {
        return "Error!";
    }
}

export function htmlEntities(str) {
    return String(str).replace(/&/g, ' &amp ').replace(/</g, ' &lt ').replace(/>/g, ' &gt ').replace(/"/g, ' &quot ').replace(/'/g, ' &sqt ').replace(/;/g, ' semicolon ').replace(/-/g, ' minus ');
}

export function validUsername(str) {
    if (str.length < 2) return `Username too short`
    else if (!str.match(/^[a-zA-Z0-9_]+$/)) return `Username may only contain alphabets, numbers & an underscore`
    else return 'good' 
}

export function validName(field, str) {
    if (str.length < 2) return `${field} too short`
    else if (!str.match(/^[a-zA-Z]+$/)) return `${field} may only contain alphabets`
    else return 'good' 
}

export function validComment(comment) {
    var format = /[`^+\-={}*[\];%:"\\|<>/~]/
    if (comment.length < 1 ) {
        return "Comments must have at least 1 characters"
    } else if (comment.length > 140) {
        return "Comments must have at most 140 characters"
    } else if (format.test(comment) == true) {
        return "Comment has strange characters. Please ony use letters, numbers and these characters (,_'.?!()#$&)"
    } else {
        return "good"
    }
}