---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

## **Figma MCP Implementation Rules for React Native**

### **General Principles**

1. Read and follow these rules carefully — no skipping steps.
2. Do not rely on past work or memory; always follow the current instructions.
3. Ask before making assumptions or introducing changes not in the design.
4. Avoid breaking changes unless explicitly approved.
5. Consider platform differences (iOS vs Android) when implementing designs.

### **Assets for Mobile**

5. Download all visual assets (images, SVGs, icons, illustrations) directly from Figma.
6. Store assets in the correct `assets/` directory with platform considerations:
   - Use multiple resolutions for images (@1x, @2x, @3x for iOS)
   - Organize by feature or screen type
   - Ensure proper file formats (PNG, JPEG for images; SVG for vector icons)
7. Do not use placeholders or mock images.
8. Ensure images are optimized for mobile and fit within React Native Image component constraints.
9. Use **React Native SVG** library for vector icons when available.
10. Consider safe area and different screen densities when sizing assets.
11. Confirm all assets are saved locally and properly imported in React Native.

### **Design Accuracy for Mobile**

11. Match all colors, typography, spacing, padding, and dimensions exactly as in Figma.
12. Convert Figma designs to React Native StyleSheet with proper units (no px, use numbers).
13. Maintain pixel-perfect layouts and responsiveness for different mobile screen sizes.
14. Align all elements using Flexbox properties (justifyContent, alignItems, etc.).
15. Handle safe areas properly for modern mobile devices (notches, rounded corners).
16. Consider platform-specific design guidelines (iOS Human Interface Guidelines, Material Design).

### **React Native Development Practices**

14. Use **StyleSheet.create()** for all styling:
    - Convert Figma CSS properties to React Native style properties
    - Use camelCase for style properties (backgroundColor, not background-color)
    - Use numbers for dimensions (no 'px' suffix)
    - Group related styles logically
15. Use proper React Native components:
    - View for containers (not div)
    - Text for text content (required for all text)
    - TouchableOpacity/Pressable for interactive elements
    - ScrollView or FlatList for scrollable content
16. If adding a new React Native library, get approval first.
17. Update any existing component if it deviates from the Figma design.
18. Add new components to `src/components/` with proper TypeScript interfaces.
19. Use React hooks and Redux Toolkit for state management.
20. Implement proper TypeScript types for all props and styles.
21. Consider keyboard behavior for forms (KeyboardAvoidingView).
22. Test on both iOS and Android platforms when design has platform-specific elements.

### **StyleSheet Conversion Examples**

```typescript
// Figma CSS → React Native StyleSheet
// background-color: #007AFF; → backgroundColor: '#007AFF'
// font-size: 16px; → fontSize: 16
// padding: 12px 16px; → paddingVertical: 12, paddingHorizontal: 16
// border-radius: 8px; → borderRadius: 8
// display: flex; → (default in React Native)
// justify-content: center; → justifyContent: 'center'
// align-items: center; → alignItems: 'center'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
```
