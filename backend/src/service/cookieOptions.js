const cookieOptions = {
    httpOnly : true,
    secure : true,
    sameSite : process.env.SAME_SITE_POLICY || 'Strict',
    expires : new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000)
}

export default cookieOptions