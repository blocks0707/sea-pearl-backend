import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { credential } from "firebase-admin";
import dotenv from 'dotenv';
dotenv.config();
//import * as serviceAccount from "../../../service_account.json";
//import * as functions from "firebase-functions";




const serviceAccount = {
  "type": process.env.TYPE,
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
  "universe_domain": process.env.UNIVERSE_DOMAIN
}
// // private_key에서 이스케이프된 줄바꿈 문자를 실제 줄바꿈으로 변환
// const parsedServiceAccount = {
//     ...serviceAccount,
//     "private_key": serviceAccount.private_key.replace(/\\n/g, '\n')
// };

const app = initializeApp({
    credential: credential.cert(serviceAccount as any),
    storageBucket: "sea-pearl-b432b.appspot.com"
});




// const app = initializeApp();
export const db = getFirestore(app);

export const bucket = getStorage(app).bucket();
