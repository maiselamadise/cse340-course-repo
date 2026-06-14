```js id="m2q7kp"
import {
    getVolunteerProjectsByUserId
} from '../models/volunteers.js';

export const getDashboard =
    async (req, res) => {

        try {

            const volunteerProjects =
                await getVolunteerProjectsByUserId(
                    req.session.user.user_id
                );

            res.render(
                'dashboard',
                {
                    title: 'Dashboard',

                    name: req.session.user.name,

                    email: req.session.user.email,

                    role: req.session.user.role,

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
```
