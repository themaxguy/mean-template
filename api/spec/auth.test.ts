/**
 * Test file for the Auth routes
 */
import conn from '@db/index';
import app from '@server';
import request from 'supertest';
import logger from '@shared/Logger';
import { cookieProps, loginFailedErr } from '@shared/constants';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';

const authPath = '/api/auth';
const signupPath = `${authPath}/signup`;
const loginPath = `${authPath}/login`;
const logoutPath = `${authPath}/logout`;

describe('Auth Routes', () => {
  beforeAll(async () => {
    try {
      // connect to db
      await conn.connectToDB();
    } catch (err) {
      logger.error(err);
    }
  });

  afterAll(async () => {
    try {
      // close db connection
      await conn.close();
    } catch (err) {
      logger.error(err);
    }
  });

  // signup test
  describe(`POST: ${signupPath}`, () => {
    it('Should successfully add a new user and return a jwt', async () => {
      const testUser = {
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
        email: 'test@mail.com',
        username: 'username',
        password: 'testPassword',
      };

      const { body, header, status } = await request(app)
        .post(`${signupPath}`)
        .send(testUser);

      // here we're testing for an empty body, jwt cookie, and OK status
      expect(body).toEqual('');
      expect(header['set-cookie'][0]).toContain(cookieProps.key);
      expect(status).toBe(OK);
    });

    it('Should not return successfully without all required parameters', async () => {
      const noEmailUser = {
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
        username: 'username',
        password: 'testPassword',
      };

      const noPasswordUser = {
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
        email: 'test@mail.com',
        username: 'username',
      };

      const noUsernameUser = {
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
        email: 'test@mail.com',
        password: 'testPassword',
      };

      let res = await request(app).post(`${signupPath}`).send(noPasswordUser);
      expect(res.status).toBe(BAD_REQUEST);

      res = await request(app).post(`${signupPath}`).send(noEmailUser);
      expect(res.status).toBe(BAD_REQUEST);

      res = await request(app).post(`${signupPath}`).send(noUsernameUser);
      expect(res.status).toBe(BAD_REQUEST);
    });

    it('Should not allow duplicate users', async () => {
      const testUser = {
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
        email: 'test@mail.com',
        username: 'username',
        password: 'testPassword',
      };

      try {
        await request(app).post('/api/auth/signup').send(testUser);
      } catch (err) {
        expect(err.message).toEqual(
          'MongoError: E11000 duplicate key error dup key: { : "username" }'
        );
      }
    });
  });

  describe(`POST: ${loginPath}`, () => {
    it(`should return a response with a status of ${OK} and a cookie with a jwt if the login was successful.`, async () => {
      const credentials = {
        email: 'test@mail.com',
        password: 'testPassword',
      };

      const { body, header, status } = await request(app)
        .post(`${loginPath}`)
        .send(credentials);

      // here we're testing for an empty body, jwt cookie, and OK status
      expect(body).toEqual('');
      expect(header['set-cookie'][0]).toContain(cookieProps.key);
      expect(status).toBe(OK);
    });

    it(`should return a response with a status of ${UNAUTHORIZED} and the error "${loginFailedErr}" if the email was not found.`, async () => {
      const credentials = {
        email: 'invalid@mail.com',
        password: 'testPassword',
      };

      const { body, header, status } = await request(app)
        .post(`${loginPath}`)
        .send(credentials);

      // here we're testing for an empty body, jwt cookie, and OK status
      expect(header['set-cookie']).not.toBeDefined();
      expect(status).toBe(UNAUTHORIZED);
      expect(body.error).toBe(loginFailedErr);
    });

    it(`should return a response with a status of ${UNAUTHORIZED} and the error "${loginFailedErr}" if the password failed.`, async () => {
      const credentials = {
        email: 'test@mail.com',
        password: 'notThePassword',
      };

      const { body, header, status } = await request(app)
        .post(`${loginPath}`)
        .send(credentials);

      // here we're testing for an empty body, jwt cookie, and OK status
      expect(header['set-cookie']).not.toBeDefined();
      expect(status).toBe(UNAUTHORIZED);
      expect(body.error).toBe(loginFailedErr);
    });

    it(`should return a response with a status of ${BAD_REQUEST} and the error  "${loginFailedErr}" if the email wasn't present in the request.`, async () => {
      const credentials = {
        password: 'testPassword',
      };

      const { body, header, status } = await request(app)
        .post(`${loginPath}`)
        .send(credentials);

      // here we're testing for an empty body, jwt cookie, and OK status
      expect(header['set-cookie']).not.toBeDefined();
      expect(status).toBe(BAD_REQUEST);
      expect(body.error).toBe(loginFailedErr);
    });

    it(`should return a response with a status of ${BAD_REQUEST} and the error  "${loginFailedErr}" if the password wasn't present in the request.`, async () => {
      const credentials = {
        email: 'test@mail.com',
      };

      const { body, header, status } = await request(app)
        .post(`${loginPath}`)
        .send(credentials);

      // here we're testing for an empty body, jwt cookie, and OK status
      expect(header['set-cookie']).not.toBeDefined();
      expect(status).toBe(BAD_REQUEST);
      expect(body.error).toBe(loginFailedErr);
    });
  });

  describe(`GET: ${logoutPath}`, () => {
    it(`should return a response with a status of ${OK}.`, async () => {
        const { status } = await request(app).get(`${logoutPath}`);
        expect(status).toBe(OK);
    });
  });
});
