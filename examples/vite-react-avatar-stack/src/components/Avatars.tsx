import { useState } from "react";
import classNames from "classnames";
import { FunctionComponent } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useClickOutsideList from "../hooks/useClickOutsideList";

import {
  MAX_USERS_BEFORE_LIST,
  calculateRightOffset,
  calculateTotalWidth,
} from "../utils/helpers";

import type { Member } from "../utils/helpers";

import styles from "./Avatars.module.css";

dayjs.extend(relativeTime);

const OtherAvatars = ({
  users,
  usersCount,
}: {
  users: Member[];
  usersCount: number;
}) => {
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);

  return (
    <>
      {users.map((user, index) => {
        const rightOffset = calculateRightOffset({ usersCount, index });
        const userInitials = user.profileData.name
          .split(" ")
          .map((word: string) => word.charAt(0))
          .join("");

        const initialsCSS = classNames(
          {
            [styles.textWhite]: user.isConnected,
            [styles.inactiveColor]: !user.isConnected,
          },
          styles.nameOthers,
        );

        const statusIndicatorCSS = classNames(
          {
            [styles.statusIndicatorOnline]: user.isConnected,
            [styles.inactiveBackground]: !user.isConnected,
          },
          styles.statusIndicator,
        );

        return (
          <div
            className={styles.avatarContainer}
            key={user.clientId}
            style={{
              right: rightOffset,
              zIndex: users.length - index,
            }}
          >
            <div
              className={styles.avatar}
              style={{
                backgroundColor: user.isConnected
                  ? user.profileData.memberColor
                  : "#C6CED9",
              }}
              onMouseOver={() => setHoveredClientId(user.clientId)}
              onMouseLeave={() => setHoveredClientId(null)}
              id="avatar"
            >
              <p className={initialsCSS}>{userInitials}</p>
              <div className={statusIndicatorCSS} id="status-indicator" />
            </div>

            {hoveredClientId === user.clientId ? (
              <div className={styles.popup}>
                <UserInfo user={user} />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const UserInfo: FunctionComponent<{ user: Member; isSelf?: boolean }> = ({
  user,
  isSelf,
}) => {
  const initials = user.profileData.name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("");

  const statusIndicatorText = user.isConnected
    ? "Online"
    : "Last seen " + dayjs().to(user.lastEvent.timestamp);

  const name = isSelf
    ? `${user.profileData.name} (You)`
    : user.profileData.name;

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          backgroundColor: user.isConnected
            ? user.profileData.memberColor
            : "rgb(229 231 235)",
        }}
        className={styles.userInfoContainer}
        id="avatar"
      >
        <p
          style={{ color: user.isConnected ? "#fff" : "rgb(156 163 175)" }}
          className={styles.smallText}
        >
          {initials}
        </p>
      </div>

      {/* 💡 Display the name of the user from the `profileData` object 💡 */}
      <div id="user-list" className={styles.userList}>
        <p className={styles.name}>{name}</p>
        <div className={styles.wrapper}>
          <div
            style={{
              backgroundColor: user.isConnected
                ? "rgb(34 197 94)"
                : "rgb(100 116 139)",
            }}
            className={styles.statusIndicator}
          />
          <p className={styles.statusIndicatorText}>{statusIndicatorText}</p>
        </div>
      </div>
    </div>
  );
};

const Surplus: FunctionComponent<{ otherUsers: Member[] }> = ({
  otherUsers,
}) => {
  const [showList, setShowList] = useState(false);
  const { listRef, plusButtonRef } = useClickOutsideList(() =>
    setShowList(false),
  );

  return otherUsers.length > MAX_USERS_BEFORE_LIST ? (
    <div className={styles.surplusContainer}>
      <div
        className={styles.badge}
        style={{
          zIndex: otherUsers.length + 50,
        }}
        ref={plusButtonRef}
        onClick={() => {
          setShowList(!showList);
        }}
      >
        +{otherUsers.slice(MAX_USERS_BEFORE_LIST).length}
      </div>

      {showList ? (
        <div className={styles.list} ref={listRef}>
          {otherUsers.slice(MAX_USERS_BEFORE_LIST).map((user) => (
            <div className={styles.user} key={user.clientId}>
              <UserInfo user={user} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  ) : null;
};

const Avatars = ({
  otherUsers,
  self,
}: {
  otherUsers: Member[];
  self: Member | null;
}) => {
  const [hover, setHover] = useState(false);
  const totalWidth = calculateTotalWidth({ users: otherUsers });

  return (
    <div className={styles.container} style={{ width: `${totalWidth}px` }}>
      <div
        className={styles.avatar}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <p className={styles.name}>You</p>
        <div className={styles.statusIndicatorOnline} id="status-indicator" />

        {hover && self ? (
          <div className={styles.popup}>
            <UserInfo user={self} isSelf={true} />
          </div>
        ) : null}
      </div>
      <OtherAvatars
        usersCount={otherUsers.length}
        users={otherUsers.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
      />
      {/** 💡 Dropdown list of surplus users 💡 */}
      <Surplus otherUsers={otherUsers} />
    </div>
  );
};

export default Avatars;
