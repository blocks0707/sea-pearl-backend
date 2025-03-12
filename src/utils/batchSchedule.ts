import {createPearlRaffleJob, createShellRaffleJob, choosePearlRaffleWinnerJob, chooseShellRaffleWinnerJob} from "../services/batchService";
import { onSchedule } from "firebase-functions/v2/scheduler";



// try {
//     choosePearlRaffleWinnerJob();
// } catch (error) {
//     console.error('Error in choosePearlRaffleWinnerJob:', error);
// }

// try {
//     createPearlRaffleJob();
// } catch (error) {
//     console.error('Error in createPearlRaffleJob:', error);
// }
export const pearlRaffleChooseBatch = onSchedule({
  schedule: "every 10 minutes",
  timeZone: "UTC",
  region: "us-central1"
}, async (_context) => {
  try {
    await choosePearlRaffleWinnerJob();
    // void 반환 (return 문 없음)
  } catch (err) {
    console.error(err);
    // void 반환 (return 문 없음)
  }
});


export const shellRaffleChooseBatch = onSchedule({
    schedule: "every 10 minutes",
    timeZone: "UTC",
    region: "us-central1"
  }, async (_context) => {
    try {
      await chooseShellRaffleWinnerJob();
      // void 반환 (return 문 없음)
    } catch (err) {
      console.error(err);
      // void 반환 (return 문 없음)
    }
  });


  export const pearlRaffleCreateBatch = onSchedule({
    schedule: "every 10 minutes",
    timeZone: "UTC",
    region: "us-central1"
  }, async (_context) => {
    try {
      await createPearlRaffleJob();
      // void 반환 (return 문 없음)
    } catch (err) {
      console.error(err);
      // void 반환 (return 문 없음)
    }
  });


  export const shellRaffleCreateBatch = onSchedule({
    schedule: "every 10 minutes",
    timeZone: "UTC",
    region: "us-central1"
  }, async (_context) => {
    try {
      await createShellRaffleJob();
      // void 반환 (return 문 없음)
    } catch (err) {
      console.error(err);
      // void 반환 (return 문 없음)
    }
  });


// try {
//     chooseShellRaffleWinnerJob();
// } catch (error) {
//     console.error('Error in chooseShellRaffleWinnerJob:', error);
// }


// try {
//     createPearlRaffleJob();
// } catch (error) {
//     console.error('Error in createPearlRaffleJob:', error);
// }

// try {
//     createShellRaffleJob();
// } catch (error) {
//     console.error('Error in createShellRaffleJob:', error);
// }
