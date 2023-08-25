import { useState, useEffect } from "react";
import { SpaceMember, Space } from "@ably-labs/spaces";

const useSpaceMembers = (space: Space) => {
  const [otherMembers, setOtherMembers] = useState<SpaceMember[]>([]);
  const [allMembers, setAllMembers] = useState<SpaceMember[]>([]);
  const [self, setSelf] = useState<SpaceMember | undefined>(undefined);

  useEffect(() => {
    if (!space) return;

    /** 💡 Listen to space members entering and leaving 💡 */
    space.members.subscribe(() =>
      (async () => {
        const others = await space.members.getOthers();
        setOtherMembers(others);
        const all = await space.members.getAll();
        setAllMembers(all);
        const self = await space.members.getSelf();
        setSelf(self);
      })(),
    );

    return () => {
      /** 💡 Remove any listeners on unmount 💡 */
      space?.off();
    };
  }, [space]);

  return { self, otherMembers, allMembers };
};

export default useSpaceMembers;
