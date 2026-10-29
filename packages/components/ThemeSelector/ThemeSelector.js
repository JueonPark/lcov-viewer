import React, { useLayoutEffect, useState } from 'react';
import { getSavedTheme, THEMES, THEME_STORAGE_KEY } from './themes';
import classes from './ThemeSelector.module.less';

const ThemeSelector = () => {
  const [theme, setTheme] = useState(getSavedTheme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = event => {
    const nextTheme = event.target.value;
    setTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Keep the selection usable even when it cannot be persisted.
    }
  };

  return (
    <label className={classes.root}>
      <span className={classes.label}>Theme</span>
      <span className={classes.swatches} aria-hidden="true">
        <span/><span/><span/>
      </span>
      <select className={classes.select} value={theme} onChange={changeTheme}>
        {THEMES.map(({ id, name, mode }) => (
          <option key={id} value={id}>{name} · {mode}</option>
        ))}
      </select>
    </label>
  );
};

export default ThemeSelector;
