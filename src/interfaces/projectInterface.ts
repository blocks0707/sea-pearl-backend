import { Timestamp } from "firebase-admin/firestore";

export interface ProjectCollection {
  id: string;
  projectNumber: number;
  name: string;
  logo: string;
  enabled: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


export type CreateProject = Pick<ProjectCollection, "name"> & Partial<Omit<ProjectCollection, "name">>;

export type UpdateProject = Pick<ProjectCollection, "id"> & Partial<Omit<ProjectCollection, "id">>;

export type ProjectResponse = Pick<ProjectCollection, "id"> & Partial<Omit<ProjectCollection, "id">>;

export type FindProjectById = Pick<ProjectCollection, "id">

export type FindProjectByProjectNumber = Pick<ProjectCollection, "projectNumber">

export type FindProjectByName = Pick<ProjectCollection, "name">

export type DeleteProject = Pick<ProjectCollection, "id">;