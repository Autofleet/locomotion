import 'react-native';

declare module 'react-native' {
  interface UIManagerStatic {
    showPopupMenu(
      node: number,
      items: string[],
      onError: () => void,
      onSelect: (action: string, buttonIndex: number) => void,
    ): void;
  }
}
