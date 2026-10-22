import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

/** Fire-and-forget: a public visitor opened the site (once per session). */
export async function trackView() {
  try {
    await setDoc(doc(db, "settings", "analytics"), { views: increment(1) }, { merge: true });
  } catch (error) {
    console.error("Failed to track view:", error);
  }
}

/** Fire-and-forget: a public visitor clicked a link in the profile link list. */
export async function trackLinkClick(linkId) {
  if (!linkId) return;
  try {
    await setDoc(
      doc(db, "settings", "analytics"),
      { clicks: { [linkId]: increment(1) } },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to track click:", error);
  }
}
