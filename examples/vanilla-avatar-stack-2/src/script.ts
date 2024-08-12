import Spaces, { type SpaceMember } from "@ably/spaces";
import { Realtime } from 'ably';
import { nanoid } from 'nanoid';

export type Member = Omit<SpaceMember, "profileData"> & {
  profileData: { memberColor: string; name: string };
};

const client = new Realtime.Promise({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY as string,
});

const spaces = new Spaces(client);
const space = await spaces.get('avatar-stack');

const mockNames: string[] = ["Anum Reeve", "Tiernan Stubbs", "Hakim Hernandez"];
const mockColors: string[] = ["#9951F5", "#f1c232", "#f44336"];

/** 💡 Add every avatar that enters 💡 */
space.members.subscribe('enter', (memberUpdate: SpaceMember) => {
  const member: Member = {
    ...memberUpdate,
    profileData: {
      memberColor: (memberUpdate.profileData as any).memberColor,
      name: (memberUpdate.profileData as any).name,
    }
  };
  addAvatar(member, true);
});

/** 💡 Enter the space as soon as it's available 💡 */
await space.enter({
  name: mockNames[Math.floor(Math.random() * mockNames.length)],
  memberColor: mockColors[Math.floor(Math.random() * mockColors.length)],
}).then(async () => {
  const otherMembers = await space.members.getOthers();

  /** 💡 Get first four except the local member in the space 💡 */
  space.members.subscribe('enter', (memberUpdate: SpaceMember) => {
    if (memberUpdate.profileData && typeof memberUpdate.profileData === 'object' &&
        typeof (memberUpdate.profileData as any).memberColor === 'string' &&
        typeof (memberUpdate.profileData as any).name === 'string') {

      const member: Member = {
        ...memberUpdate,
        profileData: {
          memberColor: (memberUpdate.profileData as any).memberColor,
          name: (memberUpdate.profileData as any).name,
        }
      };

      addAvatar(member, true);
    } else {
      console.warn('Received a member with invalid profile data:', memberUpdate);
    }
  });

  /** 💡 Get a count of the number exceeding four and display as a single tally 💡 */
  if (otherMembers.length > 4) {
    const avatarsElement = document.getElementById('avatars');
    if (avatarsElement) {
      const avatarElement = document.createElement('div');
      avatarElement.className = 'avatar';
      avatarElement.style.backgroundColor = '#595959';

      const nameElement = document.createElement('p');
      nameElement.className = 'textWhite nameOthers';
      nameElement.textContent = `+${otherMembers.length - 4}`;

      avatarElement.appendChild(nameElement);
      avatarsElement.appendChild(avatarElement);
    }
  }
}).catch((err) => {
  console.error('Error joining space:', err);
});

function createUserInfo(user: Member, isSelf: boolean = false): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';

  const userInfoContainer = document.createElement('div');
  userInfoContainer.className = 'userInfoContainer';
  userInfoContainer.style.backgroundColor = user.profileData.memberColor;
  userInfoContainer.id = 'avatar';

  const userInitials = user.profileData.name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("");

  const initials = document.createElement('p');
  initials.className = 'smallText';
  initials.textContent = userInitials;

  userInfoContainer.appendChild(initials);
  wrapper.appendChild(userInfoContainer);

  const userList = document.createElement('div');
  userList.className = 'userList';
  userList.id = 'user-list';

  const nameElement = document.createElement('p');
  nameElement.className = 'name';
  nameElement.textContent = isSelf ? user.profileData.name + ' (You)' : user.profileData.name;

  userList.appendChild(nameElement);
  wrapper.appendChild(userList);

  return wrapper;
}

async function addAvatar(user: Member, isSelf: boolean = false): Promise<void> {
  const userInitials = user.profileData.name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("");

  const avatarsElement = document.getElementById('avatars');
  if (avatarsElement) {
    const avatarElement = document.createElement('div');
    avatarElement.className = isSelf ? 'selfAvatar' : 'otherAvatar';

    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatarContainer';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.backgroundColor = user.profileData.memberColor;
    avatar.setAttribute('data-member-id', user.clientId);
    avatar.setAttribute('key', user.clientId);

    const initials = document.createElement('p');
    initials.className = "textWhite";
    initials.textContent = userInitials;

    avatar.appendChild(initials);

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.display = 'none';

    const userInfo = createUserInfo(user, isSelf);
    avatarElement.appendChild(avatarContainer);
    avatarContainer.appendChild(avatar);
    popup.appendChild(userInfo);
    avatar.appendChild(popup);

    avatarsElement.appendChild(avatarElement);

    avatar.addEventListener('mouseover', () => {
      popup.style.display = 'block';
    });

    avatar.addEventListener('mouseleave', () => {
      popup.style.display = 'none';
    });
  }
}
