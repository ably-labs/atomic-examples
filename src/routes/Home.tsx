import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const spaceNameInParams = url.searchParams.get("space");

    if (spaceNameInParams) {
      url.searchParams.delete("space");
      window.history.replaceState({}, "", `?${url.searchParams.toString()}`);
    }
  }, []);

  return (
    <ul>
      <li>
        <a href="/component-locking">Component locking</a>
      </li>
      <li>
        <a href="/member-location">Member location</a>
      </li>
      <li>
        <a href="/live-cursors">Live cursors</a>
      </li>
      <li>
        <a href="/avatar-stack">Avatar stack</a>
      </li>
      <li>
        <a href="/emoji-reactions">Emoji Reactions</a>
      </li>
      <li>
        <a href="/user-claims">User Claims</a>
      </li>
      <li>
        <a href="/vanilla-avatar-stack">Avatar Stack - Vanilla JS</a>
      </li>
      <li>
        <a href="/vanilla-avatar-stack-2">Avatar Stack - Vanilla JS (Revised)</a>
      </li>
      <li>
        <a href="/vite-react-avatar-stack">Avatar Stack - React</a>
      </li>
      <li>
        <a href="/vite-react-avatar-stack-2">Avatar Stack - React (Revised)</a>
      </li>
    </ul>
  );
};
export default Home;
