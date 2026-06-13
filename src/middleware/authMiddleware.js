export const requireLogin = (
    req,
    res,
    next
) => {

    if (!req.session.user) {

        req.flash(
            'error',
            'You must be logged in.'
        );

        return res.redirect('/login');
    }

    next();
};