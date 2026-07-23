# Mobile Interface Design Reference

Load this reference only for accepted iOS, Android, or cross-platform mobile delivery surfaces.

## Platform Contract

- Define platform-appropriate navigation, back behavior, controls, gestures, safe areas, system bars, keyboard behavior, and appearance modes.
- Support text scaling, screen readers, orientation, device-size variation, and reduced motion.
- Design permission requests at the moment their value is understandable and include denial, revocation, and settings recovery.
- Preserve user intent across slow networks, offline periods, backgrounding, interruption, termination, and restoration when relevant.
- Define touch targets, pressed feedback, destructive actions, haptics only when meaningful, and gesture alternatives.
- Distinguish shared product semantics from deliberate iOS and Android differences.

## Accepted Stack Mappings

### SwiftUI

Use iOS navigation, controls, safe-area, Dynamic Type, VoiceOver, permission, sheet, and system feedback conventions unless accepted product evidence justifies deviation.

### Jetpack Compose

Use Android navigation, system back, adaptive layout, Material semantics, TalkBack, permission, system-bar, and lifecycle conventions unless accepted evidence justifies deviation.

### React Native

Define where iOS and Android behavior differs instead of forcing identical navigation or controls. Development owns native modules, navigation libraries, and component implementation.

### Flutter

Define shared design foundations and explicit platform adaptations. Development owns widget architecture, state management, navigation packages, and native integration.
