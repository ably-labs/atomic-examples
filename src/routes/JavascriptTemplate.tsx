import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import type { ProjectInfo } from "../utils/types";
import AvatarStack from "../../examples/vite-avatar-stack/src/App";
import Spaces from "@ably/spaces";

const Project = ({ spaces }: { spaces: Spaces }) => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  useEffect(() => {
    setProjectInfo({
      name: "Avatar stack",
      docsLink: "https://ably.com/docs/spaces/avatar",
      repoNameAndPath: "realtime-examples/tree/main/examples/vite-avatar-stack",
      topic: "avatar-stack",
      learnMore: true,
      description:
        "See your online presence in a space displayed as an Avatar. Open in a new window or share the link to see multiple users.",
    });
  }, []);

  return <AvatarStack spaces={spaces} />;
};

export default Project;
