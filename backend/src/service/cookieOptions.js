const cookieOptions = {
    httpOnly : true,
    expires : new Date(Date.now() + 7*24*60*60*1000),
    sameSite : 'Strict'
}

export default cookieOptions