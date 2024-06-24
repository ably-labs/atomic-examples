import { useMemo, useEffect } from "react";
import { type SpaceMember } from "@ably/spaces";
import { useSpace, useMembers } from "@ably/spaces/react";

import Avatars from "./Avatars";
import styles from "./AvatarStack.module.css";

const colors = [
  "#9951F5",
  "#7A1BF2",
  "#5F0BC9",
];

export const mockNames = [
  "Anum Reeve",
  "Tiernan Stubbs",
  "Hakim Hernandez",
];

type Member = Omit<SpaceMember, "profileData"> & {
  profileData: { memberColor: string; name: string };
};

const AvatarStack = () => {
  const name = useMemo(() => {
    return mockNames[Math.floor(Math.random() * mockNames.length)];
  }, []);
  const memberColor = useMemo(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  /** 💡 Get a handle on a space instance 💡 */
  const { space } = useSpace();

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    space?.enter({ name, memberColor });
  }, [space]);

  /** 💡 Get everybody except the local member in the space and the local member 💡 */
  const { others, self } = useMembers();

  return (
    <div id="avatar-stack" className={`example-container ${styles.avatarStackContainer}`}>
      {/** 💡 Stack of first 5 user avatars including yourself.💡 */}
      <Avatars self={self as Member | null} otherUsers={others as Member[]} />
    </div>
  );
};

export default AvatarStack;
