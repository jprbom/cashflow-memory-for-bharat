import type { Express } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { requirePermission } from './auth.js';
import type { JsonDatabase } from './db.js';
import { computeCreditReadiness } from './engine.js';
import { cashflowEntryInputSchema, profileInputSchema, readinessInputSchema } from './schemas.js';

const nonEmptyPatch = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.partial().refine((value) => Object.keys(value).length > 0, 'Patch must contain at least one field.');

export function registerRoutes(app: Express, db: JsonDatabase) {
  app.get('/api/metrics', requirePermission('read'), async (_req, res, next) => {
    try {
      const profiles = await db.list<any>('profiles');
      const entries = await db.list<any>('cashflowEntries');
      const monthlyInflow = profiles.reduce((sum, profile) => sum + profile.monthlyInflow, 0);
      const monthlyOutflow = profiles.reduce((sum, profile) => sum + profile.monthlyOutflow, 0);
      res.json({
        kpis: {
          profiles: profiles.length,
          averageReadinessScore: Math.round(profiles.reduce((sum, profile) => sum + profile.readinessScore, 0) / Math.max(profiles.length, 1)),
          monthlyInflow,
          monthlyOutflow,
          activeConsent: profiles.filter((profile) => profile.consentStatus === 'ACTIVE').length,
          entries: entries.length
        },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/profiles', requirePermission('read'), async (_req, res, next) => {
    try {
      res.json(await db.list('profiles'));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/profiles', requirePermission('write'), async (req, res, next) => {
    try {
      const body = profileInputSchema.parse(req.body);
      const item = { id: 'profile_' + randomUUID(), createdAt: new Date().toISOString(), ...body };
      res.status(201).json(await db.create('profiles', item));
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/profiles/:id', requirePermission('write'), async (req, res, next) => {
    try {
      const patch = nonEmptyPatch(profileInputSchema).parse(req.body);
      res.json(await db.update('profiles', String(req.params.id), patch));
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/profiles/:id', requirePermission('admin'), async (req, res, next) => {
    try {
      await db.delete('profiles', String(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/cashflow-entries', requirePermission('read'), async (_req, res, next) => {
    try {
      res.json(await db.list('cashflowEntries'));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/cashflow-entries', requirePermission('write'), async (req, res, next) => {
    try {
      const body = cashflowEntryInputSchema.parse(req.body);
      const item = { id: 'cash_' + randomUUID(), createdAt: new Date().toISOString(), ...body };
      res.status(201).json(await db.create('cashflowEntries', item));
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/cashflow-entries/:id', requirePermission('write'), async (req, res, next) => {
    try {
      const patch = nonEmptyPatch(cashflowEntryInputSchema).parse(req.body);
      res.json(await db.update('cashflowEntries', String(req.params.id), patch));
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/cashflow-entries/:id', requirePermission('admin'), async (req, res, next) => {
    try {
      await db.delete('cashflowEntries', String(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/credit-readiness', requirePermission('read'), (req, res, next) => {
    try {
      res.json(computeCreditReadiness(readinessInputSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  });
}


