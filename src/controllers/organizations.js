import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId
} from '../models/organizations.js';

export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title: 'Organizations',
            organizations
        });
    } catch (err) {
        next(err);
    }
};

export const showOrganizationDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const organization = await getOrganizationDetails(id);

        if (!organization) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(id);

        res.render('organizationDetails', {
            title: organization.name,
            organization,
            projects
        });
    } catch (err) {
        next(err);
    }
};