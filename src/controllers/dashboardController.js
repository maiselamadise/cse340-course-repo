export const getDashboard =
    async (req, res) => {

        try {

            const volunteerProjects =
                await getUserVolunteerProjects(
                    req.session.user.user_id
                );

            res.render(
                'dashboard',
                {
                    title: 'Dashboard',
                    user: req.session.user,
                    volunteerProjects
                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).send(
                'Server Error'
            );
        }
    };