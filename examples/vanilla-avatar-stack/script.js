import Spaces from '@ably/spaces'
import { Realtime } from 'ably'
import { nanoid } from 'nanoid'
import classNames from "classnames";

const MAX_USERS_BEFORE_LIST = 4;
const HORIZONTAL_SPACING_OFFSET = 40;
const OVERLAP_AMOUNT = 40;
const AVATAR_WIDTH = 48;

const client = new Realtime.Promise({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
})

const spaces = new Spaces(client)
const space = await spaces.get('avatar-stack')
const avatarStack = document.getElementById('avatar-stack')

function calculateRightOffset(options) {
  const { usersCount, index = 0 } = options;

  return usersCount > MAX_USERS_BEFORE_LIST
    ? (index + 1) * HORIZONTAL_SPACING_OFFSET
    : index * HORIZONTAL_SPACING_OFFSET;
}

function calculateTotalWidth(users) {
  return (
    AVATAR_WIDTH +
    OVERLAP_AMOUNT * Math.min(users.length, MAX_USERS_BEFORE_LIST + 1)
  );
}

const mockNames = ["Anum Reeve", "Tiernan Stubbs", "Hakim Hernandez"]
const mockColors = ["#9951F5", "#1BF5C3", "#F54A4A"]

await space.enter({
  name: mockNames[Math.floor(Math.random() * mockNames.length)],
  memberColor: mockColors[Math.floor(Math.random() * mockColors.length)],
}).then(async () => {
  const otherMembers = await space.members.getOthers();

  await getMyAvatar()
  getOtherAvatars(otherMembers.slice(0, MAX_USERS_BEFORE_LIST).reverse())
}).catch((err) => {
  console.error('Error joining space:', err);
})

// Subscribe to member enters in a space
space.members.subscribe('enter', (member) => {
  addAvatar(member, otherMembers.length)
})

// Subscribe to member leaves in a space
space.members.subscribe(['leave', 'remove'], (member) => {
  const avatarElement = avatarStack.querySelector(
    `.avatar[data-member-id="${member.clientId}"]`
  )
  if (avatarElement) {
    avatarElement.remove()
  }
})

async function getMyAvatar() {
  const self = await space.members.getSelf()
  const initialsCSS = classNames(
    {
      ["textWhite"]: self.isConnected,
      ["inactiveColor"]: !self.isConnected,
    },
    "nameOthers",
  );
  const statusIndicatorCSS = classNames(
    {
      ["statusIndicatorOnline"]: self.isConnected,
      ["inactiveBackground"]: !self.isConnected,
    },
    "statusIndicator",
  );

  const avatars = document.getElementById('avatars')
  const avatar = document.createElement('div')
  avatar.className = 'avatar'
  avatar.style.backgroundColor = self.isConnected
    ? self.profileData.memberColor
    : "#C6CED9"
  avatar.setAttribute('data-member-id', self.clientId);

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.display = 'none';

  const userInfo = createUserInfo(self)
  popup.appendChild(userInfo);

  avatar.appendChild(popup);

  avatar.addEventListener('mouseover', function() {
    popup.style.display = 'block'
  });

  avatar.addEventListener('mouseleave', function() {
    popup.style.display = 'none'
  });

  const initials = document.createElement('p')
  initials.className = initialsCSS
  initials.textContent = 'You'

  const statusIndicator = document.createElement('div')
  statusIndicator.className = statusIndicatorCSS
  statusIndicator.id = 'status-indicator'

  avatars.appendChild(avatar)
  avatar.appendChild(initials)
  avatar.appendChild(statusIndicator)
}

async function addAvatar(user, usersCount, index = 0) {
    const rightOffset = calculateRightOffset({ usersCount, index });
    const userInitials = user.profileData.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");

    const initialsCSS = classNames(
      {
        ["textWhite"]: user.isConnected,
        ["inactiveColor"]: !user.isConnected,
      },
      "nameOthers",
    );

    const statusIndicatorCSS = classNames(
      {
        ["statusIndicatorOnline"]: user.isConnected,
        ["inactiveBackground"]: !user.isConnected,
      },
      "statusIndicator",
    );

    const avatarsElement = document.getElementById('avatars')
    avatarsElement.style.right = rightOffset
    avatarsElement.style.zIndex = usersCount - index

    const avatar = document.createElement('div')
    avatar.className = 'avatar'
    avatar.style.backgroundColor = user.isConnected
      ? user.profileData.memberColor
      : "#C6CED9";
    avatar.setAttribute('data-member-id', user.clientId);

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.display = 'none';

    const userInfo = createUserInfo(user)
    popup.appendChild(userInfo);

    avatar.appendChild(popup);

    avatar.addEventListener('mouseover', function() {
      popup.style.display = 'block'
    });

    avatar.addEventListener('mouseleave', function() {
      popup.style.display = 'none'
    });

    const initials = document.createElement('p')
    initials.className = initialsCSS
    initials.textContent = userInitials

    const statusIndicator = document.createElement('div')
    statusIndicator.className = statusIndicatorCSS
    statusIndicator.id = 'status-indicator'

    avatarsElement.appendChild(avatar)
    avatar.appendChild(initials)
    avatar.appendChild(statusIndicator)
}

async function getOtherAvatars(otherMembers) {
  const usersCount = otherMembers.length

  {otherMembers.map((user, index) => {
      addAvatar(user, usersCount, index)
  })}
}

function createUserInfo(user, isSelf = false) {
  const userDiv = document.createElement('div')
  userDiv.className = 'user'

  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  userDiv.appendChild(wrapper);

  const initials = user.profileData.name
    .split(" ")
    .map(word => word.charAt(0))
    .join("");

  const name = isSelf
    ? `${user.profileData.name} (You)`
    : user.profileData.name;

  const userInfoContainer = document.createElement('div');
  userInfoContainer.className = 'userInfoContainer';
  userInfoContainer.style.backgroundColor = user.isConnected
    ? user.profileData.memberColor
    : "rgb(229 231 235)";
  userInfoContainer.id = 'avatar';
  wrapper.appendChild(userInfoContainer)

  const initialsElement = document.createElement('p');
  initialsElement.className = 'smallText';
  initialsElement.style.color = user.isConnected ? "#fff" : "rgb(156 163 175)";
  initialsElement.textContent = initials;

  userInfoContainer.appendChild(initialsElement);

  const userListContainer = document.createElement('div');
  userListContainer.className = 'userList';
  userListContainer.id = 'user-list';

  const nameElement = document.createElement('p');
  nameElement.className = 'name';
  nameElement.textContent = name;

  userListContainer.appendChild(nameElement);

  wrapper.appendChild(userInfoContainer);
  wrapper.appendChild(userListContainer);

  return userDiv;
}

const otherMembers = await space.members.getOthers()
document.getElementById('avatars').style.width = calculateTotalWidth(otherMembers)
