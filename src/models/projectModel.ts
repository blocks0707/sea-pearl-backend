import { db } from '../config/db';
import { ProjectResponse, CreateProject, UpdateProject } from '../interfaces/projectInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const PROJECTS_COLLECTION = 'projects';

export const createProject = async (projectData: CreateProject): Promise<string> => {
  try {
    const projectRef = await db.collection(PROJECTS_COLLECTION).add({
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return projectRef.id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProject = async (updateData: UpdateProject): Promise<void> => {
  try {
    await db.collection(PROJECTS_COLLECTION).doc(updateData.id).update({
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};



export const findProjectById = async (projectId: string): Promise<ProjectResponse> => {
  try {
    const snapshot = await db.collection(PROJECTS_COLLECTION).doc(projectId).get();
    if(!snapshot.exists){
      throw new CustomError(404, 'Project not found');
    }
    return { id: snapshot.id, ...snapshot.data() } as ProjectResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findProjectByNumber = async (projectNumber: number): Promise<ProjectResponse> => {
  try {
  const snapshot = await db.collection(PROJECTS_COLLECTION)
    .where('projectNumber', '==', projectNumber)
    .limit(1)
    .get();
  if(snapshot.empty){
    throw new CustomError(404, 'Project not found');
  }
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as ProjectResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getAllProject = async (): Promise<ProjectResponse[] | []> => {
  try {
    const snapshot = await db.collection(PROJECTS_COLLECTION).orderBy('projectNumber', 'asc').get();
    if(snapshot.empty){
      return [];
    }
    const projects: ProjectResponse[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as ProjectResponse);
    });

    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getAllProjectNumber = async (): Promise<number> => {
  try {
    const snapshot = await db.collection(PROJECTS_COLLECTION).get();
    const projects: ProjectResponse[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as ProjectResponse);
    });
    return projects.length;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await db.collection(PROJECTS_COLLECTION).doc(projectId).delete();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
