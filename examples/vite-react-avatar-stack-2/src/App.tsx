import { useMemo, useEffect } from "react";
import { SpaceProvider, SpacesProvider, useMembers, useSpace } from "@ably/spaces/react";
import Spaces, { type SpaceMember } from "@ably/spaces";
import { Avatar } from "./components/Avatar";
import "./styles/avatars.css";

export type Member = Omit<SpaceMember, "profileData"> & {
  profileData: { memberColor: string; name: string };
};

const colors = ["#9951F5", "#f1c232", "#f44336"];
const mockNames = [
  "Anum Reeve",
  "Tiernan Stubbs",
  "Hakim Hernandez",
];

function Example() {
  const name = useMemo(() => {
    return mockNames[Math.floor(Math.random() * mockNames.length)];
  }, []);
  const memberColor = useMemo(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const { space } = useSpace();

  useEffect(() => {
    space?.enter({ name, memberColor });
  }, [space]);

  const { others, self } = useMembers();
  const hasMoreUsers = others.length > 3;

  return (
    <div className="avatarStackContainer">
      <div className="avatars">
        {self && (
          <div className="selfAvatar" key={self.clientId}>
            <Avatar user={self as Member} isSelf={true} />
          </div>
        )}

        {others.slice(0, 4).map(( other ) => {
          return (
            <div className="otherAvatar" key={other.clientId}>
              <Avatar user={other as Member} isSelf={false} />
            </div>
          );
        })}

        {hasMoreUsers &&
          <div className="avatar"
            style={{
              backgroundColor: '#595959'
            }}
          >
            <p className="textWhite nameOthers">+{others.length-4}</p>
          </div>
        }
      </div>
    </div>
  );
}

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name="random-name">
      <Example />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
