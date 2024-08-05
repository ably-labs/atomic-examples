import Spaces from '@ably/spaces'
import { Realtime } from 'ably'
import { nanoid } from 'nanoid'

const client = new Realtime.Promise({
    clientId: nanoid(),
    key: import.meta.env.VITE_ABLY_KEY,
})

const spaces = new Spaces(client)
const space = await spaces.get('avatar-stack')

const mockNames = ["Anum Reeve", "Tiernan Stubbs", "Hakim Hernandez"]
const mockColors = ["#9951F5", "#f1c232", "#f44336"];

/** 💡 Add every avatar that enters 💡 */
space.members.subscribe('enter', (memberUpdate) => {
    addAvatar(memberUpdate, true);
});

/** 💡 Enter the space as soon as it's available 💡 */
await space.enter({
  name: mockNames[Math.floor(Math.random() * mockNames.length)],
  memberColor: mockColors[Math.floor(Math.random() * mockColors.length)],
}).then(async () => {
  const otherMembers = await space.members.getOthers();

  /** 💡 Get first four except the local member in the space 💡 */
  {otherMembers.slice(0, 4).map((user) => {
      addAvatar(user)
  })}

  /** 💡 Get a count of the number exceeding four and display as a single tally 💡 */
  if (otherMembers.length > 4) {
    const avatarsElement = document.getElementById('avatars')
    const avatarElement = document.createElement('div')
    avatarElement.className='avatar'
    avatarElement.style.backgroundColor = '#595959'

    const nameElement = document.createElement('p')
    nameElement.className='textWhite nameOthers'
    nameElement.textContent = `+${otherMembers.length-4}`

    avatarsElement.appendChild(avatarElement)
    avatarElement.appendChild(nameElement)
  }
}).catch((err) => {
  console.error('Error joining space:', err);
})

function createUserInfo(user, isSelf = false) {
  const wrapper = document.createElement('div')
  wrapper.className = 'wrapper'

  const userInfoContainer = document.createElement('div')
  userInfoContainer.className = 'userInfoContainer'
  userInfoContainer.style.backgroundColor = user.profileData.memberColor
  userInfoContainer.id = 'avatar'

  const userInitials = user.profileData.name
  .split(" ")
  .map((word) => word.charAt(0))
  .join("");

  const initials = document.createElement('p')
  initials.className = 'smallText'
  initials.textContent = userInitials

  userInfoContainer.appendChild(initials)
  wrapper.appendChild(userInfoContainer)

  const userList = document.createElement('div')
  userList.className = 'userList'
  userList.id = 'user-list'

  const nameElement = document.createElement('p')
  nameElement.className = 'name'
  nameElement.textContent = isSelf ? user.profileData.name + ' (You)' : user.profileData.name

  userList.appendChild(nameElement)
  wrapper.appendChild(userList)

  return wrapper;
}

async function addAvatar(user, isSelf = false) {
  const userInitials = user.profileData.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");

  const avatarsElement = document.getElementById('avatars')
  const avatarElement = document.createElement('div')
  avatarElement.className = isSelf ? 'selfAvatar' : 'otherAvatar'

  const avatarContainer = document.createElement('div')
  avatarContainer.className = 'avatarContainer'

  const avatar = document.createElement('div')
  avatar.className = 'avatar'
  avatar.style.backgroundColor = user.profileData.memberColor
  avatar.setAttribute('data-member-id', user.clientId)
  avatar.setAttribute('key', user.clientId)

  const initials = document.createElement('p')
  initials.className = "textWhite"
  initials.textContent = userInitials

  avatar.appendChild(initials)

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.display = 'none';

  const userInfo = createUserInfo(user, isSelf)
  avatarsElement.appendChild(avatarElement)
  avatarElement.appendChild(avatarContainer)
  avatarContainer.appendChild(avatar)
  popup.appendChild(userInfo);
  avatar.appendChild(popup);

  avatar.addEventListener('mouseover', () => {
    popup.style.display = 'block'
  });

  avatar.addEventListener('mouseleave', () => {
    popup.style.display = 'none'
  });
}
