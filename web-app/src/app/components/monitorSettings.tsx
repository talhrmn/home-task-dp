// "use client";

// import React, { useCallback, useState } from "react";
// import { SiteType, useSiteContext } from "./siteContext";
// import styles from "../styles/addNewSiteWindow.module.css";

// type TrafficSystemConfigType = {
//     green: number,
//     yellow: number,
//     red: number,
// }

// export const MonitorSettings = () => {
//   const { allSites, setAllSites } = useSiteContext();
//   const [latencyInterval, setLatencyInterval] = useState<number>(30);
//   const [trafficSystemConfig, settrafficSystemConfig] =
//     useState<TrafficSystemConfigType>({
//         green: 500,
//         yellow: 1000,
//         red: 1000,
//     });

//   const onApply = useCallback(async () => {
//     try {

//       setNewSiteName("");
//       setNewSiteURL("");
//       setNewTimeInterval("");
//     } catch (error) {
//       console.error(`Failed to add to site ${error}`);
//     }
//   }, []);

//   return (
//     <>
//       <code className={styles.code}>Monitor Settings</code>
//       <div className={styles.editItem}>
//         <h3 className={styles.h3}>Time Interval:</h3>
//         <input
//           className={styles.editInput}
//           type="text"
//           value={latencyInterval || ""}
//           onChange={(e) =>
//             setLatencyInterval((prev) => ({
//               ...prev,
//               timeInterval:  as unknown as number,
//             }))
//           }
//           placeholder="Seconds"
//         />
//       </div>
//       <div className={styles.editItem}>
//         <h3 className={styles.h3}>Red: </h3>
//         <input
//           className={styles.editInput}
//           type="text"
//           value={editedValues.timeInterval || ""}
//           onChange={(e) =>
//             setEditedValues((prev) => ({
//               ...prev,
//               timeInterval: e.target.value as unknown as number,
//             }))
//           }
//           placeholder={monitor.timeInterval as unknown as string}
//         />
//       </div>
//       <div className={styles.editItem}>
//         <h3 className={styles.h3}>Interval:</h3>
//         <input
//           className={styles.editInput}
//           type="text"
//           value={editedValues.timeInterval || ""}
//           onChange={(e) =>
//             setEditedValues((prev) => ({
//               ...prev,
//               timeInterval: e.target.value as unknown as number,
//             }))
//           }
//           placeholder={monitor.timeInterval as unknown as string}
//         />
//       </div>
//       <div className={styles.editItem}>
//         <h3 className={styles.h3}>Interval:</h3>
//         <input
//           className={styles.editInput}
//           type="text"
//           value={editedValues.timeInterval || ""}
//           onChange={(e) =>
//             setEditedValues((prev) => ({
//               ...prev,
//               timeInterval: e.target.value as unknown as number,
//             }))
//           }
//           placeholder={monitor.timeInterval as unknown as string}
//         />
//       </div>
//     </>
//   );
// };
