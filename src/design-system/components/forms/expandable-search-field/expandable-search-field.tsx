"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";

import { SearchIcon } from "../../../icons";
import { SearchField, type SearchFieldProps } from "../search-field";
import styles from "./expandable-search-field.module.css";

export const ExpandableSearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function ExpandableSearchField({ label, value, onClear, autoFocus, className, ...props }, ref) {
    const [expanded, setExpanded] = useState(Boolean(autoFocus));
    const input = useRef<HTMLInputElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const panelId = useId();
    const open = expanded || value.length > 0;
    const inputRef = useCallback((element: HTMLInputElement | null) => {
      input.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    }, [ref]);

    useEffect(() => {
      if (expanded) input.current?.focus();
    }, [expanded]);

    function close() {
      onClear?.();
      setExpanded(false);
      trigger.current?.focus();
    }

    return <div className={[styles.root, open && styles.expanded, className].filter(Boolean).join(" ")}
      data-expandable-search data-expanded={open}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget) && !value) setExpanded(false);
      }}
      onKeyDown={event => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}>
      <button ref={trigger} type="button" className={styles.trigger} aria-label={open ? "Close search" : label}
        aria-expanded={open} aria-controls={panelId} onClick={() => open ? close() : setExpanded(true)}>
        <SearchIcon size={20} aria-hidden="true" />
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <SearchField {...props} ref={inputRef} className={styles.field} label={label} value={value} onClear={onClear} />
      </div>
    </div>;
  },
);
