/**
 * Utility functions for handling validation errors
 */

/**
 * Extracts validation errors and adds them as flash messages
 * @param {Object} errors - validationResult(req) object
 * @param {Object} req - Express request object
 */
export const flashValidationErrors = (errors, req) => {
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return true;
    }
    return false;
};

/**
 * Handles validation error response with redirect
 * @param {Object} errors - validationResult(req) object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} redirectPath - Where to redirect on error
 * @returns {boolean} true if errors were found and handled
 */
export const handleValidationErrors = (errors, req, res, redirectPath) => {
    if (flashValidationErrors(errors, req)) {
        res.redirect(redirectPath);
        return true;
    }
    return false;
};
