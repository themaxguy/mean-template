import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError } from '@shared/constants';
import { adminMW } from './middleware';
import { UserRoles } from '@daos/User/UserSchema';

// Init shared
const router = Router().use(adminMW);

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  return null;
});

/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
  return null;
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
  return null;
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
