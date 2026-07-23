# Desktop Interface Design Reference

Load this reference only for accepted desktop delivery surfaces.

## Platform Contract

- Design for pointer and keyboard parity, visible focus, shortcuts, context menus, selection, drag and drop, and precise input where relevant.
- Define minimum, default, restored, maximized, and multi-window behavior.
- Specify resizing, reflow, panes, dense data, high-DPI scaling, text scaling, and theme behavior.
- Use native menu, dialog, file, clipboard, notification, and window conventions where they support the accepted workflow.
- Preserve user state across window closure, restart, long-running work, and interrupted operations when relevant.
- Optimize professional tools for scanning, comparison, repeated action, and discoverable commands.

## Accepted Stack Mappings

### JavaFX

Define cross-desktop interaction and adaptive window behavior without prescribing scene graph or controller architecture.

### WPF, WinUI 3, And UWP

Use accepted Windows navigation, command, focus, window, accessibility, scaling, and system integration conventions. Development owns XAML structure and framework services.

### Avalonia

Define shared cross-platform behavior and explicit operating-system adaptations. Do not assume identical native conventions on every target.

### Uno Platform

Separate shared product intent from the behavior required by each accepted Uno target. Development owns platform projects and implementation composition.
