import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import AvatarStack from "./components/AvatarStack";
import { getSpaceNameFromUrl } from "./utils/helpers";

const spaceName = getSpaceNameFromUrl();

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name={spaceName}>
      <AvatarStack />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
