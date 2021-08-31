import { NativeError } from 'mongoose';
import { ObjectId } from '../utils/utils';
import { DocumentType as Doc } from '@typegoose/typegoose';
import faker from 'faker';

import server from '../config/server';
import { connectToDB, dropDB } from '../config/db';

import request from 'supertest';
const req = request(server);

import { Patient } from './patients.model';
import {
  PatientModel,
  TrialModel,
  SiteModel,
  GroupModel,
  EndpointModel,
} from '../models';

beforeAll(async () => {
  await connectToDB('patienttestdb');
});

describe('GET /api/patients/', () => {
  it('should get a Patient by id', async () => {
    const patient = await PatientModel.create({
      dccid: 'fakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/consent/form',
      screenFail: false,
    });
    const id = patient._id.toString();

    const response = await req.get(`/api/patients/id/${id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(id);
  });

  it('should get a Patient by email', async () => {
    const patient = await PatientModel.create({
      dccid: 'fakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/consent/form',
      screenFail: false,
    });
    const email = patient.email;

    const response = await req.get(`/api/patients/email/${email}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toEqual(email);
  });

  it('should return a 400 when ObjectId or email is invalid or missing', async () => {
    await req.get('/api/patients/id/69').expect(400);
    await req.get('/api/patients/email/69').expect(400);
  });

  it('should return a 404 when ObjectId or email not found', async () => {
    await req.get(`/api/patients/id/${ObjectId()}`).expect(404);
    await req.get(`/api/patients/email/${faker.internet.email()}`).expect(404);
  });
});

describe('POST /api/patients/', () => {
  it('should create an Patient with only required fields', async () => {
    const patient = {
      dccid: 'fakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/consent/form',
      screenFail: false,
    };

    const res = await req.post('/api/patients/').send(patient);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeTruthy();
    expect(res.body.name).toStrictEqual(patient.name);
    expect(res.body.endpoints).toStrictEqual([]);
  });

  it('should return a 400 when trying to create an Patient without required fields', async () => {
    await req
      .post('/api/patients/')
      .send({
        dccid: 'fakedccid',
        // name: faker.name.firstName(),
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        phoneNumber: faker.datatype.number({
          min: 1111111111,
          max: 9999999999,
        }),
        consentForm: 'fake/url/to/consent/form',
        screenFail: false,
      })
      .expect(400);
  });
});

describe('PUT /api/patients/:patientid', () => {
  let patientid: string;
  let endpointid: string;

  let siteid: ObjectId, trialid: ObjectId, groupid: ObjectId;

  beforeAll(async () => {
    const patient = await PatientModel.create({
      dccid: 'newfakedccid',
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      phoneNumber: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
      consentForm: 'fake/url/to/diff/consent/form',
      screenFail: true,
      documents: ['test document'],
    });
    patientid = patient._id.toString();

    const trial = await TrialModel.create({
      name: 'Test Trial',
      status: 'pending',
    });
    trialid = trial._id.toString();

    const site = await SiteModel.create({
      name: 'Test Site',
      address: faker.address.streetAddress(),
    });
    siteid = site._id.toString();

    const group = await GroupModel.create({
      name: 'Test Group',
    });
    groupid = group._id.toString();

    const endpoint = await EndpointModel.create({
      name: 'Test Endpoint',
      date: Date.now(),
      description: 'Test Description',
      site: siteid,
      trial: trialid,
      group: groupid,
      patient: patientid,
    });
    endpointid = endpoint._id.toString();

    await PatientModel.findById(
      patientid,
      (err: NativeError, patient: Doc<Patient>) => {
        patient.endpoints.push(endpoint._id);
        patient.save();
      }
    );
  });

  it('should reject an invalid update operation', async () => {
    let reqBody = {
      operation: 'invalid operation',
      payload: '',
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(400);
  });

  it('should not update a nonexistant patient', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'Test Patient',
    };

    await req.put(`/api/patients/id/${ObjectId()}`).send(reqBody).expect(404);
  });

  it('should reject an invalid payload', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 12,
    };
    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(400);
  });

  it('should rename', async () => {
    let reqBody = {
      operation: 'rename',
      payload: 'New Test Patient',
    };
    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.name).toBe(reqBody.payload);
  });

  it('should update address', async () => {
    let reqBody = {
      operation: 'update address',
      payload: faker.address.streetAddress(),
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.address).toStrictEqual(reqBody.payload);
  });

  it('should update email', async () => {
    let reqBody = {
      operation: 'update email',
      payload: faker.internet.email(),
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.email).toBe(reqBody.payload);
  });

  it('should update phoneNumber', async () => {
    let reqBody = {
      operation: 'update phoneNumber',
      payload: faker.datatype.number({ min: 1111111111, max: 9999999999 }),
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.phoneNumber).toBe(reqBody.payload);
  });

  it('should add documents', async () => {
    let reqBody = {
      operation: 'add documents',
      payload: ['new test document'],
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.documents).toContain(reqBody.payload[0]);
  });

  it('should remove documents', async () => {
    let reqBody = {
      operation: 'remove documents',
      payload: ['test document'],
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.documents).not.toContain(reqBody.payload[0]);
  });

  it('should add endpoints', async () => {
    const newendpoint = await EndpointModel.create({
      name: 'New Test Endpoint',
      date: Date.now(),
      description: 'New Test Description',
      site: siteid,
      trial: trialid,
      group: groupid,
      patient: patientid,
    });
    let reqBody = {
      operation: 'add endpoints',
      payload: [newendpoint._id],
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.endpoints).toContainEqual(reqBody.payload[0]);
  });

  it('should remove endpoints', async () => {
    let reqBody = {
      operation: 'remove endpoints',
      payload: [endpointid],
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.endpoints).not.toContain(reqBody.payload[0]);
  });

  it('should change site', async () => {
    const site = await SiteModel.create({
      name: 'New Test Site',
      address: faker.address.streetAddress(),
    });
    let newsiteid = site._id.toString();

    let reqBody = {
      operation: 'change site',
      payload: newsiteid,
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.site.toString()).toBe(newsiteid);
  });

  it('should change group', async () => {
    const group = await GroupModel.create({
      name: 'New Test Group',
    });
    let newgroupid = group._id.toString();

    let reqBody = {
      operation: 'change group',
      payload: newgroupid,
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.group.toString()).toBe(newgroupid);
  });

  it('should change trial', async () => {
    const trial = await TrialModel.create({
      name: 'Test Trial',
      status: 'pending',
    });
    let newtrialid = trial._id.toString();

    let reqBody = {
      operation: 'change trial',
      payload: newtrialid,
    };

    await req.put(`/api/patients/id/${patientid}`).send(reqBody).expect(204);

    const updatedPatient = await PatientModel.findById(patientid).lean();
    expect(updatedPatient.trial.toString()).toBe(newtrialid);
  });
});

afterAll(async () => {
  await dropDB();
});
