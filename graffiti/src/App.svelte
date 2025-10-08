<script>
  import { Router, Route, Link } from "svelte-routing";
  import P5Canvas from './lib/P5Canvas.svelte';
  import Display from './lib/Display.svelte';
  export const url = "";
</script>

  <Router {url}>
  <main>
    <Route path="/">
      <P5Canvas />
    </Route>
    <Route path="/display">
      <nav>
        <Link to="/">お絵描きページ</Link>
        <Link to="/display">投影ページ</Link>
      </nav>
      <Display />
    </Route>
  </main>
</Router>

<style>
  /* ナビゲーションを少し見やすくするスタイル */
  nav {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
    background: rgba(0,0,0,0.5);
    padding: 5px 10px;
    border-radius: 5px;
  }
  nav a, nav a:visited {
    color: white;
    margin: 0 10px;
    text-decoration: none;
  }
</style>
